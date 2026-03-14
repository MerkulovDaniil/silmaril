"""Thin wrapper so ``python app.py`` keeps working.

All logic lives in the ``vault_viewer`` package.
"""
from vault_viewer import app, main  # noqa: F401

if __name__ == "__main__":
    main()
