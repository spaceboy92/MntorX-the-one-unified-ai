"""Lightweight privacy-first security checks for generated workspaces."""
from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path

SECRET_PATTERNS = (
    re.compile(r"AKIA[0-9A-Z]{16}"),
    re.compile(r"(?i)(api[_-]?key|secret|token)\s*=\s*['\"][^'\"]{12,}['\"]"),
)


@dataclass(frozen=True, slots=True)
class Finding:
    path: Path
    line: int
    message: str


class SecurityScanner:
    def scan_text(self, path: Path, text: str) -> list[Finding]:
        findings: list[Finding] = []
        for line_number, line in enumerate(text.splitlines(), start=1):
            if any(pattern.search(line) for pattern in SECRET_PATTERNS):
                findings.append(Finding(path, line_number, "Potential secret detected"))
        return findings
