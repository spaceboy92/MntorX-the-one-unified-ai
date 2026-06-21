"""Asynchronous multi-agent orchestration primitives for Aether IDE."""
from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from enum import StrEnum
from typing import Iterable


class AgentRole(StrEnum):
    CEO = "CEO Agent"
    ARCHITECT = "Architect Agent"
    CODING = "Coding Agent"
    DEBUG = "Debug Agent"
    TEST = "Test Agent"
    SECURITY = "Security Agent"
    DEVOPS = "DevOps Agent"
    UI = "UI Agent"
    GAME = "Game Agent"
    ML = "ML Agent"
    RESEARCH = "Research Agent"


@dataclass(slots=True)
class AgentResult:
    role: AgentRole
    summary: str
    artifacts: list[str] = field(default_factory=list)


@dataclass(slots=True)
class AetherAgent:
    role: AgentRole
    responsibilities: tuple[str, ...]

    async def run(self, goal: str) -> AgentResult:
        await asyncio.sleep(0)
        focus = ", ".join(self.responsibilities[:3])
        return AgentResult(self.role, f"{self.role} processed '{goal}' with focus on {focus}.")


DEFAULT_AGENTS: tuple[AetherAgent, ...] = (
    AetherAgent(AgentRole.CEO, ("planning", "delegation", "acceptance")),
    AetherAgent(AgentRole.ARCHITECT, ("architecture", "databases", "infrastructure")),
    AetherAgent(AgentRole.CODING, ("code generation", "refactoring", "project scaffolding")),
    AetherAgent(AgentRole.DEBUG, ("root-cause analysis", "patches", "execution replay")),
    AetherAgent(AgentRole.TEST, ("unit tests", "integration tests", "benchmarks")),
    AetherAgent(AgentRole.SECURITY, ("secret scanning", "sandbox policy", "dependency audit")),
    AetherAgent(AgentRole.DEVOPS, ("Docker", "CI/CD", "cloud deployment")),
    AetherAgent(AgentRole.UI, ("editor UX", "glassmorphism", "workspace layout")),
    AetherAgent(AgentRole.GAME, ("2D/3D", "Roblox Lua", "Unity/Unreal")),
    AetherAgent(AgentRole.ML, ("PyTorch", "training dashboards", "ONNX inference")),
    AetherAgent(AgentRole.RESEARCH, ("documentation", "source synthesis", "offline cache")),
)


class MultiAgentOrchestrator:
    """Runs Aether's agents concurrently and preserves deterministic result order."""

    def __init__(self, agents: Iterable[AetherAgent] = DEFAULT_AGENTS) -> None:
        self._agents = tuple(agents)

    async def execute(self, goal: str) -> list[AgentResult]:
        tasks = [agent.run(goal) for agent in self._agents]
        return list(await asyncio.gather(*tasks))
