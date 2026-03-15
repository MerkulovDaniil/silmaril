---
tags:
  - reference
  - pdf
---

# PDF & File Support

Silmaril serves any file from the vault. Non-text files are served with the correct MIME type.

## How it works

Place a PDF in your vault:

```
vault/
├── notes/
│   └── my-note.md
└── files/
    └── paper.pdf     ← accessible at /files/paper.pdf
```

Link to it from any note: `[Download paper](files/paper.pdf)`

## Supported file types

| Type | Extensions | Behavior |
|------|-----------|----------|
| Markdown | `.md` | Rendered as HTML |
| Text | `.txt`, `.csv`, `.json`, `.yaml` | View / Edit / Raw |
| Images | `.png`, `.jpg`, `.gif`, `.svg` | Served directly |
| PDF | `.pdf` | Served directly (browser renders) |
| Video | `.mp4`, `.webm` | Served directly |
| Audio | `.mp3`, `.ogg` | Served directly |
| Bases | `.base` | Cards / Table / List views |
| Canvas | `.canvas` | Read-only SVG render |
| Other | `.*` | Download |
