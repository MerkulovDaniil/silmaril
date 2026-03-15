---
tags:
  - python
  - reference
---

# Python Snippets

Useful code patterns I keep coming back to.

## FastAPI minimal app

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "hello"}
```

## Async file reading

```python
import asyncio
from pathlib import Path

async def read_files(paths: list[Path]) -> list[str]:
    async def read_one(p):
        return await asyncio.to_thread(p.read_text)
    return await asyncio.gather(*[read_one(p) for p in paths])
```

## Dataclass with validation

```python
from dataclasses import dataclass, field
from typing import Optional

@dataclass
class Config:
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False
    tags: list[str] = field(default_factory=list)

    def __post_init__(self):
        if not 1 <= self.port <= 65535:
            raise ValueError(f"Invalid port: {self.port}")
```

## CLI with argparse

```python
import argparse

parser = argparse.ArgumentParser(description="My tool")
parser.add_argument("--input", "-i", required=True, help="Input file")
parser.add_argument("--output", "-o", default="out.json", help="Output file")
parser.add_argument("--verbose", "-v", action="store_true")
args = parser.parse_args()
```

## Retry decorator

```python
import time
from functools import wraps

def retry(max_attempts=3, delay=1.0):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    time.sleep(delay * (2 ** attempt))
        return wrapper
    return decorator
```
