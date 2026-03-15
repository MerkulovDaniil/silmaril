#!/bin/sh
exec silmaril --vault /docs --port ${PORT:-8080} --title "Silmaril" --host 0.0.0.0
