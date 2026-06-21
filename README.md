# Aether IDE

Aether IDE is a production-oriented prototype of a universal AI development environment. It combines a Python-first orchestration backend with a modern desktop-ready frontend shell.

## What is included

- A runnable glassmorphism IDE shell with file explorer, smart editor, live preview, terminal, build matrix, and multi-agent board.
- Python backend scaffolding for FastAPI orchestration, async multi-agent collaboration, project generation, sandbox execution, and security scanning.
- Tests for the orchestrator, project generator, and security scanner.
- Architecture documentation in [`docs/AETHER_IDE.md`](docs/AETHER_IDE.md).

## Run the frontend

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Test backend modules

```bash
python3 -m pytest aether_ide/tests
```

## Run the backend API

Install backend dependencies first:

```bash
python3 -m pip install fastapi uvicorn pydantic
uvicorn aether_ide.backend.main:app --reload
```

Then open `http://localhost:8000/health`.
