import React, { useMemo, useState } from 'react';

type AgentStatus = 'idle' | 'planning' | 'coding' | 'testing' | 'secure' | 'done';

type Agent = {
  name: string;
  role: string;
  status: AgentStatus;
  output: string;
};

type FileNode = {
  path: string;
  language: string;
  content: string;
  dirty?: boolean;
};

const initialFiles: FileNode[] = [
  {
    path: 'projects/aether-demo/README.md',
    language: 'markdown',
    content: '# Aether Demo\n\nDescribe what you want to build, then run the autonomous plan.',
  },
  {
    path: 'projects/aether-demo/src/main.py',
    language: 'python',
    content: 'def main():\n    print("Aether runtime online")\n\nif __name__ == "__main__":\n    main()\n',
  },
  {
    path: 'projects/aether-demo/web/index.html',
    language: 'html',
    content: '<main><h1>Aether Live Preview</h1><p>Hot preview surface ready.</p></main>',
  },
];

const agents: Agent[] = [
  { name: 'CEO Agent', role: 'Plans, delegates, and accepts work', status: 'planning', output: 'Product brief decomposed into architecture, UI, runtime, and security tracks.' },
  { name: 'Architect Agent', role: 'Designs systems, data, and infrastructure', status: 'done', output: 'Event-driven FastAPI backend with WebSocket orchestration and plugin boundaries.' },
  { name: 'Coding Agent', role: 'Generates and edits code', status: 'coding', output: 'Scaffolding project files, editor actions, and preview adapters.' },
  { name: 'Debug Agent', role: 'Inspects traces and patches failures', status: 'idle', output: 'Waiting for terminal or test failures.' },
  { name: 'Test Agent', role: 'Creates and runs checks', status: 'testing', output: 'Unit, integration, and benchmark suites queued.' },
  { name: 'Security Agent', role: 'Scans secrets, dependencies, and sandbox risk', status: 'secure', output: 'Ethical-only policy, isolated execution, and audit gates enabled.' },
  { name: 'DevOps Agent', role: 'Docker, CI/CD, and deployment', status: 'idle', output: 'Docker, Kubernetes, Vercel, Render, Railway, and AWS adapters registered.' },
  { name: 'UI Agent', role: 'Builds interfaces and design systems', status: 'done', output: 'Glassmorphism workspace with draggable panel model and command palette.' },
  { name: 'Game Agent', role: '2D/3D/gameplay/Roblox/Unity/Unreal help', status: 'idle', output: 'Physics, NPC AI, inventory, recoil, networking, and Roblox Lua templates ready.' },
  { name: 'ML Agent', role: 'Datasets, training, checkpoints, inference', status: 'idle', output: 'PyTorch, TensorFlow, ONNX, RL, GAN, diffusion, and fine-tuning workflows available.' },
  { name: 'Research Agent', role: 'Searches docs and summarizes findings', status: 'idle', output: 'Offline docs cache first; online research requires explicit opt-in.' },
];

const capabilities = [
  '100+ language generation', 'AI autocomplete', 'inline refactor', 'lint/error highlights', 'minimap', 'split editor',
  'file explorer', 'live previews', 'integrated terminal', 'build matrix', 'debug suite', 'auto error correction',
  'model builder', 'game suite', 'database studio', 'deployment hub', 'voice commands', 'deep research', 'multi-model routing',
  'collaboration', 'secret scanning', 'sandbox execution', 'kanban', 'Git/PR assistant', 'plugin marketplace', 'GPU monitoring',
  'creative generation', 'Blender bridge', 'offline-first memory', 'crash recovery', 'optional telemetry',
];

const statusClass: Record<AgentStatus, string> = {
  idle: 'bg-slate-700 text-slate-200',
  planning: 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/30',
  coding: 'bg-violet-500/20 text-violet-200 border border-violet-400/30',
  testing: 'bg-amber-500/20 text-amber-100 border border-amber-400/30',
  secure: 'bg-emerald-500/20 text-emerald-100 border border-emerald-400/30',
  done: 'bg-green-500/20 text-green-100 border border-green-400/30',
};

const AetherIDE: React.FC = () => {
  const [prompt, setPrompt] = useState('Build a battle royale game with realistic recoil and inventory.');
  const [activePath, setActivePath] = useState(initialFiles[1].path);
  const [files, setFiles] = useState(initialFiles);
  const [terminal, setTerminal] = useState<string[]>([
    '$ aether doctor',
    '✓ Python backend reachable on ws://localhost:8765',
    '✓ Sandbox policy: docker/firejail adapter pending host configuration',
    '✓ Local-first memory and crash recovery enabled',
  ]);

  const activeFile = files.find((file) => file.path === activePath) ?? files[0];
  const previewHtml = useMemo(() => {
    const html = files.find((file) => file.path.endsWith('index.html'))?.content ?? '';
    return `<!doctype html><html><body style="font-family:Inter,sans-serif;background:#070816;color:#e5f3ff;padding:24px">${html}</body></html>`;
  }, [files]);

  const runPlan = () => {
    setTerminal((lines) => [
      ...lines,
      `$ aether execute "${prompt}"`,
      'CEO Agent: decomposed prompt into 9 milestones.',
      'Architect Agent: selected Python FastAPI orchestration + Tauri shell.',
      'Coding Agent: generated project skeleton, docs, tests, and deployment adapters.',
      'Security Agent: sandbox and secrets checks passed.',
      'Test Agent: smoke suite passed.',
    ]);
    setFiles((current) => current.map((file) => file.path.endsWith('README.md') ? {
      ...file,
      dirty: true,
      content: `# Generated Project Plan\n\nPrompt: ${prompt}\n\n## Milestones\n- Architecture plan\n- Code generation\n- Test generation\n- Security audit\n- Deployment recipe\n`,
    } : file));
  };

  return (
    <main className="min-h-screen bg-[#050713] text-slate-100 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(88,166,255,0.25),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.24),transparent_32%)]" />
      <div className="relative z-10 grid h-screen grid-rows-[72px_1fr_220px]">
        <header className="flex items-center justify-between border-b border-white/10 bg-white/5 px-6 backdrop-blur-xl">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-300">Aether IDE</p>
            <h1 className="text-2xl font-black">Universal AI Development Environment</h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-200">Offline/Online Ready</span>
            <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-200">Python 3.12+ Core</span>
            <button onClick={runPlan} className="rounded-xl bg-cyan-400 px-4 py-2 font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-300">Run Autonomous Plan</button>
          </div>
        </header>

        <section className="grid min-h-0 grid-cols-[280px_1fr_380px] gap-3 p-3">
          <aside className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
            <h2 className="mb-3 font-bold text-cyan-100">Explorer</h2>
            {files.map((file) => (
              <button key={file.path} onClick={() => setActivePath(file.path)} className={`mb-2 w-full rounded-lg px-3 py-2 text-left text-sm ${activePath === file.path ? 'bg-cyan-400/20 text-cyan-100' : 'bg-black/20 text-slate-300 hover:bg-white/10'}`}>
                <span className="block truncate">{file.dirty ? '● ' : ''}{file.path}</span>
                <span className="text-xs text-slate-500">{file.language}</span>
              </button>
            ))}
            <h2 className="mb-3 mt-6 font-bold text-cyan-100">Capabilities</h2>
            <div className="flex flex-wrap gap-2">
              {capabilities.map((capability) => <span key={capability} className="rounded-full bg-white/10 px-2 py-1 text-xs text-slate-300">{capability}</span>)}
            </div>
          </aside>

          <section className="grid min-h-0 grid-rows-[auto_1fr] rounded-2xl border border-white/10 bg-[#090d1f]/90 backdrop-blur-xl">
            <div className="border-b border-white/10 p-4">
              <label className="mb-2 block text-sm font-semibold text-cyan-100">Natural language project prompt</label>
              <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} className="h-20 w-full resize-none rounded-xl border border-white/10 bg-black/30 p-3 font-mono text-sm text-slate-100 outline-none" />
            </div>
            <div className="grid min-h-0 grid-cols-2">
              <div className="border-r border-white/10 p-4">
                <div className="mb-2 flex items-center justify-between"><h2 className="font-bold">Smart Editor</h2><span className="text-xs text-slate-400">{activeFile.path}</span></div>
                <textarea value={activeFile.content} onChange={(event) => setFiles(files.map((file) => file.path === activeFile.path ? { ...file, content: event.target.value, dirty: true } : file))} className="h-[calc(100%-2rem)] w-full resize-none rounded-xl bg-black/40 p-4 font-mono text-sm leading-6 text-slate-100 outline-none" spellCheck={false} />
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between"><h2 className="font-bold">Live Preview</h2><span className="text-xs text-slate-400">hot reload surface</span></div>
                <iframe title="Aether live preview" srcDoc={previewHtml} className="h-[calc(100%-2rem)] w-full rounded-xl border border-white/10 bg-white" />
              </div>
            </div>
          </section>

          <aside className="min-h-0 overflow-y-auto rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
            <h2 className="mb-3 font-bold text-cyan-100">Multi-Agent Orchestration</h2>
            <div className="space-y-3">
              {agents.map((agent) => (
                <article key={agent.name} className="rounded-xl border border-white/10 bg-black/25 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2"><h3 className="font-semibold">{agent.name}</h3><span className={`rounded-full px-2 py-1 text-[10px] uppercase ${statusClass[agent.status]}`}>{agent.status}</span></div>
                  <p className="text-xs text-slate-400">{agent.role}</p>
                  <p className="mt-2 text-sm text-slate-200">{agent.output}</p>
                </article>
              ))}
            </div>
          </aside>
        </section>

        <footer className="grid grid-cols-[1fr_380px] gap-3 border-t border-white/10 bg-black/30 p-3">
          <section className="rounded-2xl border border-white/10 bg-black/50 p-4 font-mono text-sm text-emerald-200">
            <h2 className="mb-2 font-sans font-bold text-slate-100">Integrated Terminal</h2>
            <div className="h-36 overflow-y-auto whitespace-pre-wrap">{terminal.join('\n')}</div>
          </section>
          <section className="rounded-2xl border border-white/10 bg-black/50 p-4">
            <h2 className="mb-2 font-bold">Build + Deploy Matrix</h2>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
              {['pip', 'npm', 'cargo', 'gradle', 'maven', 'cmake', 'make', 'Docker', 'Kubernetes', 'Unity', 'Unreal', 'Roblox'].map((tool) => <span key={tool} className="rounded-lg bg-white/10 px-3 py-2">{tool}</span>)}
            </div>
          </section>
        </footer>
      </div>
    </main>
  );
};

export default AetherIDE;
