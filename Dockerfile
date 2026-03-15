FROM python:3.12-slim
WORKDIR /app

RUN pip install --no-cache-dir uv

COPY docs/ /docs/

ENV VAULT_ROOT=/docs
ENV VAULT_NAME=Silmaril

# Always install latest silmaril on container start
CMD uv pip install --system --upgrade silmaril && silmaril --vault /docs --port ${PORT:-8080} --host 0.0.0.0 --title Silmaril
