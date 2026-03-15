FROM python:3.12-slim
WORKDIR /app

RUN pip install --no-cache-dir silmaril

COPY docs/ /docs-pristine/
COPY docs/ /docs/
COPY playground.py .

ENV RESET_DIR=/docs-pristine

EXPOSE 8080
CMD ["uvicorn", "playground:app", "--host", "0.0.0.0", "--port", "8080"]
