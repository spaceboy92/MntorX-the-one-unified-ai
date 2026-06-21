# Aether IDE Architecture

Aether IDE is implemented as a local-first desktop IDE prototype with a Python orchestration backend and a modern glassmorphism React/Tauri-ready frontend surface.

## Modules

- `aether_ide/backend/agents`: asynchronous CEO, Architect, Coding, Debug, Test, Security, DevOps, UI, Game, ML, and Research agents.
- `aether_ide/backend/core`: prompt-to-project planning and filesystem generation.
- `aether_ide/backend/runtime`: sandbox command facade for terminal/build/test execution.
- `aether_ide/backend/security`: secret scanning and policy gates.
- `components/AetherIDE.tsx`: runnable IDE shell with explorer, smart editor, live preview, terminal, build matrix, and multi-agent status board.

## Running

```bash
npm install
npm run dev
```

Backend dependencies can be installed with:

```bash
python -m pip install fastapi uvicorn pydantic pytest pytest-asyncio
uvicorn aether_ide.backend.main:app --reload
```

## Privacy and safety

The design defaults to local execution, explicit online opt-in, optional telemetry, and ethical-only security tooling.
