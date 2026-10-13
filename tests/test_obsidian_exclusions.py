import asyncio
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

import silmaril


class ObsidianExclusionsTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.patch = patch.object(silmaril, "VAULT_ROOT", self.root)
        self.patch.start()
        self.addCleanup(self.patch.stop)
        self.config = patch.dict(silmaril.CONFIG, {"hide": [], "theme": ""})
        self.config.start()
        self.addCleanup(self.config.stop)
        for name in ("active.md", "_archive/needle.md", "_archive/nested/note.md",
                     "_archive-other/keep.md", "notes/_archive/keep.md", ".obsidian/private.md"):
            p = self.root / name
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text("needle body", encoding="utf-8")

    def settings(self, filters):
        (self.root / ".obsidian/app.json").write_text(json.dumps({"userIgnoreFilters": filters}))

    def results(self, endpoint, **kwargs):
        return json.loads(asyncio.run(endpoint(**kwargs)).body)

    def test_both_searches_exclude_archive_and_hidden_directories(self):
        self.settings(["_archive/"])
        for results in (self.results(silmaril.search_api, q="needle"),
                        self.results(silmaril.search_index)):
            paths = {r["path"] for r in results}
            self.assertEqual(paths, {"active.md", "_archive-other/keep.md", "notes/_archive/keep.md"})

    def test_settings_changes_take_effect_without_restart(self):
        self.settings(["_archive/"])
        self.assertEqual(len(self.results(silmaril.search_index)), 3)
        self.settings([])
        self.assertEqual(len(self.results(silmaril.search_index)), 5)

    def test_home_omits_archive_recents_but_tree_and_direct_access_remain(self):
        self.settings(["_archive/"])
        # Keep the actual rendered content separate from the intentionally unfiltered sidebar.
        with patch.object(silmaril, "layout", side_effect=lambda title, content: content):
            home = asyncio.run(silmaril.index())
        self.assertIn("3 notes", home)
        self.assertNotIn('href="/_archive/', home)
        self.assertIn('href="/_archive-other/keep.md"', home)
        tree = silmaril.get_file_tree(self.root)
        archive = next(x for x in tree if x["path"] == "_archive")
        self.assertTrue(archive["children"])
        response = asyncio.run(silmaril._render_file("_archive/needle.md", raw=""))
        self.assertEqual(response.body.decode(), "needle body")

    def test_literals_are_prefixes_not_globs_and_regexes_are_case_insensitive(self):
        self.settings(["_ARCHIVE/", r"/keep\.md$/", "  ", 23, "/[/"])
        self.assertEqual([r["path"] for r in self.results(silmaril.search_index)], ["active.md"])
        self.settings(["*.md"])
        self.assertEqual(len(self.results(silmaril.search_index)), 5)

    def test_missing_malformed_and_wrong_shape_settings_do_not_crash(self):
        p = self.root / ".obsidian/app.json"
        for content in (None, "{", "[]", '{"userIgnoreFilters": "_archive/"}'):
            if content is None:
                p.unlink(missing_ok=True)
            else:
                p.write_text(content)
            self.assertEqual(len(self.results(silmaril.search_index)), 5)

    def test_existing_hide_rules_apply_to_both_search_endpoints(self):
        self.settings([])
        with patch.dict(silmaril.CONFIG, {"hide": ["_archive/**"]}):
            for endpoint, kwargs in ((silmaril.search_api, {"q": "needle"}), (silmaril.search_index, {})):
                self.assertEqual(len(self.results(endpoint, **kwargs)), 3)


if __name__ == "__main__":
    unittest.main()
