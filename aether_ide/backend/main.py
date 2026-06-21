"""FastAPI entrypoint for Aether IDE's Python orchestration backend."""
from __future__ import annotations

from pathlib import Path
from typing import Any

from fastapi import FastAPI
from pydantic import BaseModel

from aether_ide.backend.agents.orchestrator import MultiAgentOrchestrator
from aether_ide.backend.core.project_generator import ProjectGenerator

app = FastAPI(title="Aether IDE Backend", version="0.1.0")
orchestrator = MultiAgentOrchestrator()
generator = ProjectGenerator(Path("aether_ide/projects"))


class PromptRequest(BaseModel):
    prompt: str
    project_name: str = "Aether Project"


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "aether-ide"}


@app.post("/plan")
async def plan(request: PromptRequest) -> dict[str, Any]:
    agent_results = await orchestrator.execute(request.prompt)
    return {
        "milestones": generator.plan(request.prompt),
        "agents": [result.__dict__ for result in agent_results],
    }


@app.post("/generate")
async def generate(request: PromptRequest) -> dict[str, Any]:
    files = generator.generate(request.project_name, request.prompt)
    return {"files": [str(file.path) for file in files]}
