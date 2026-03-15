"""Playground wrapper: adds /api/reset endpoint to silmaril for demo deployments."""
import os
import shutil
from pathlib import Path
from silmaril import app, VAULT_ROOT, _icon_cache
from fastapi.responses import JSONResponse

RESET_DIR = Path(os.environ.get("RESET_DIR", "/docs-pristine"))

@app.post("/api/reset")
async def reset_docs():
    global _icon_cache
    if not RESET_DIR.is_dir():
        return JSONResponse({"error": "no pristine dir"}, status_code=500)
    for item in VAULT_ROOT.iterdir():
        if item.is_dir():
            shutil.rmtree(item)
        else:
            item.unlink()
    shutil.copytree(RESET_DIR, VAULT_ROOT, dirs_exist_ok=True)
    _icon_cache = None
    return JSONResponse({"ok": True})
