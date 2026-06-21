from pathlib import Path

import asyncio

from aether_ide.backend.agents.orchestrator import MultiAgentOrchestrator
from aether_ide.backend.core.project_generator import ProjectGenerator
from aether_ide.backend.security.scanner import SecurityScanner


def test_orchestrator_runs_all_agents():
    results = asyncio.run(MultiAgentOrchestrator().execute("build an API"))
    assert len(results) == 11
    assert results[0].role.value == "CEO Agent"


def test_project_generator_writes_files(tmp_path: Path):
    files = ProjectGenerator(tmp_path).generate("Demo", "build a demo")
    assert (tmp_path / "demo" / "README.md").exists()
    assert len(files) == 3


def test_security_scanner_detects_secret():
    findings = SecurityScanner().scan_text(Path("config.py"), 'api_key = "123456789012345"')
    assert findings
