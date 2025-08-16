import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMentorX } from '../hooks/useNexusAI';
import { CodeFile } from '../types';
import { SUPPORTED_LANGUAGES, FileIcon, FilePlusIcon, TrashIcon, PencilIcon, RefactorIcon, BugIcon, DocumentIcon, ExplainIcon, PlayIcon, UploadIcon, ResetIcon, TestIcon, AnalyzeIcon, TasklistIcon, PlanIcon, MagicWandIcon } from '../constants';
import WidgetRenderer from './WidgetRenderer';
import AiChatPanel from './AiChatPanel';

const PreviewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>;
const ConsoleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 2.293a1 1 0 011.414 0L8 8.586l1.293-1.293a1 1 0 111.414 1.414L9.414 10l1.293 1.293a1 1 0 01-1.414 1.414L8 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L6.586 10 5.293 8.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const CodeEditorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-700" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 01-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const FullscreenEnterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.5 2a.5.5 0 00-.5.5v3a.5.5 0 001 0V3h2.5a.5.5 0 000-1H4.5zM15.5 2a.5.5 0 00-.5.5v2.5a.5.5 0 001 0V3h2.5a.5.5 0 000-1H15.5zM4.5 18a.5.5 0 00.5-.5v-2.5a.5.5 0 00-1 0V17H2a.5.5 0 000 1h2.5zM15.5 18a.5.5 0 00.5-.5v-2.5a.5.5 0 00-1 0V17h-2.5a.5.5 0 000 1H15.5z" clipRule="evenodd" /></svg>;
const FullscreenExitIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2.5 8a.5.5 0 000 1H5v2.5a.5.5 0 001 0V8.5a.5.5 0 00-.5-.5H2.5zM14 8.5a.5.5 0 00-.5-.5H11a.5.5 0 000 1h2.5V12a.5.5 0 001 0V8.5z" clipRule="evenodd" /></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>;

const FileExplorer: React.FC<{
  sessionId: string;
  files: CodeFile[];
  activeFileId: string | null;
}> = React.memo(({ sessionId, files, activeFileId }) => {
  const { addCodeFile, deleteCodeFile, renameCodeFile, setActiveCodeFile, theme, uploadWorkspace, resetWorkspace } = useMentorX();
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const handleAddNewFile = () => {
    const fileName = prompt("Enter new file name (e.g., script.js):");
    if (fileName) {
      addCodeFile(sessionId, fileName);
    }
  };

  const handleRename = (file: CodeFile) => {
    setEditingFileId(file.id);
    setNewName(file.name);
  };
  
  const handleRenameSubmit = (fileId: string) => {
    if (newName.trim()) {
      renameCodeFile(sessionId, fileId, newName.trim());
    }
    setEditingFileId(null);
    setNewName('');
  };

  return (
    <div className="w-full h-full p-2 flex flex-col" style={{backgroundColor: theme.colors.panelBg}}>
      <div className="flex justify-between items-center mb-2 p-1">
        <h3 className="text-sm font-bold uppercase tracking-wider" style={{color: theme.colors.textSecondary}}>Workspace</h3>
        <div className="flex items-center">
            <button onClick={() => uploadWorkspace(sessionId)} className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/10" title="Upload Project Folder (Conceptual)"><UploadIcon /></button>
            <button onClick={() => resetWorkspace(sessionId)} className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/10" title="Reset Project"><ResetIcon /></button>
            <button onClick={handleAddNewFile} className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/10" title="New File"><FilePlusIcon /></button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto space-y-1">
        {files.map(file => (
          <div
            key={file.id}
            onClick={() => setActiveCodeFile(sessionId, file.id)}
            className={`flex items-center justify-between w-full rounded-md text-left group text-sm cursor-pointer
              ${activeFileId === file.id ? 'text-white' : 'text-gray-400 hover:text-white'}`
            }
             style={{
                backgroundColor: activeFileId === file.id ? `${theme.colors.accent}20` : 'transparent'
             }}
          >
            <div className="flex items-center gap-2 p-1.5 flex-grow min-w-0">
              <FileIcon />
              {editingFileId === file.id ? (
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onBlur={() => handleRenameSubmit(file.id)}
                  onKeyDown={e => e.key === 'Enter' && handleRenameSubmit(file.id)}
                  autoFocus
                  className="bg-transparent border-b w-full outline-none text-white p-0"
                  style={{ borderColor: theme.colors.accent }}
                  onClick={e => e.stopPropagation()}
                />
              ) : (
                <span className="truncate" title={file.name}>{file.name}</span>
              )}
            </div>
            {editingFileId !== file.id && (
              <div className="flex items-center shrink-0 pr-1 opacity-0 group-hover:opacity-100">
                <button onClick={(e) => {e.stopPropagation(); handleRename(file);}} className="p-1 rounded-full hover:bg-white/10" aria-label="Rename file"><PencilIcon /></button>
                <button onClick={(e) => {e.stopPropagation(); deleteCodeFile(sessionId, file.id);}} className="p-1 rounded-full hover:bg-red-500/50" aria-label="Delete file"><TrashIcon /></button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

const AiToolbarButton: React.FC<{ onClick: () => void, icon: React.ReactNode, label: string, disabled: boolean }> = ({ onClick, icon, label, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={label}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-black/20 text-gray-300 hover:bg-black/40 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {icon}
            <span className="text-sm font-medium hidden sm:inline">{label}</span>
        </button>
    )
};

const CodeCanvas: React.FC = () => {
    const { activeSession, isLoading, updateCodeFile, runCode, performAiCodeAction, theme, appendOutput, clearWidgets } = useMentorX();
    const [activeTab, setActiveTab] = useState<'preview' | 'console' | 'scratchpad'>('preview');
    const [editorHeight, setEditorHeight] = useState(66);
    const mainPanelRef = useRef<HTMLDivElement>(null);
    
    // New state for UI customization
    const [chatWidth, setChatWidth] = useState(450);
    const [isChatCollapsed, setIsChatCollapsed] = useState(false);
    const [isPreviewFullScreen, setIsPreviewFullScreen] = useState(false);

    // Vertical Resizer Logic
    const handleVerticalDrag = useCallback((e: MouseEvent) => {
        if (!mainPanelRef.current) return;
        const mainPanelTop = mainPanelRef.current.getBoundingClientRect().top;
        const totalHeight = mainPanelRef.current.clientHeight;
        const newHeight = e.clientY - mainPanelTop;
        const newHeightPercent = Math.max(20, Math.min(80, (newHeight / totalHeight) * 100));
        setEditorHeight(newHeightPercent);
    }, []);

    const stopVerticalDrag = useCallback(() => {
        document.body.style.cursor = 'default';
        window.removeEventListener('mousemove', handleVerticalDrag);
        window.removeEventListener('mouseup', stopVerticalDrag);
    }, [handleVerticalDrag]);

    const startVerticalDrag = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        document.body.style.cursor = 'row-resize';
        window.addEventListener('mousemove', handleVerticalDrag);
        window.addEventListener('mouseup', stopVerticalDrag);
    }, [handleVerticalDrag, stopVerticalDrag]);
    
    // Horizontal Resizer Logic
    const handleHorizontalDrag = useCallback((e: MouseEvent) => {
        const newWidth = window.innerWidth - e.clientX;
        setChatWidth(Math.max(320, Math.min(window.innerWidth / 2, newWidth)));
    }, []);

    const stopHorizontalDrag = useCallback(() => {
        document.body.style.cursor = 'default';
        window.removeEventListener('mousemove', handleHorizontalDrag);
        window.removeEventListener('mouseup', stopHorizontalDrag);
    }, [handleHorizontalDrag]);

    const startHorizontalDrag = useCallback((e: React.MouseEvent) => {
        if (isChatCollapsed) return;
        e.preventDefault();
        document.body.style.cursor = 'col-resize';
        window.addEventListener('mousemove', handleHorizontalDrag);
        window.addEventListener('mouseup', stopHorizontalDrag);
    }, [isChatCollapsed, handleHorizontalDrag, stopHorizontalDrag]);


    if (!activeSession?.workspaceState || !activeSession.activePersonaId) return <div className="flex-1 flex items-center justify-center p-4"><p>Loading Workspace...</p></div>;
    
    const { workspaceState, id: sessionId, widgets } = activeSession;
    const activeFile = workspaceState.files.find(f => f.id === workspaceState.activeFileId);
    const hasPreview = !!workspaceState.previewHtml;

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (!event.data || typeof event.data.type !== 'string' || event.origin === window.origin) return;
            if (event.data.type === 'log' || event.data.type === 'warn' || event.data.type === 'error') {
                const prefix = event.data.type !== 'log' ? `[${event.data.type.toUpperCase()}] ` : '> ';
                appendOutput(sessionId, prefix + event.data.message);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [sessionId, appendOutput]);

    useEffect(() => {
        if (!hasPreview && activeTab === 'preview') setActiveTab('console');
    }, [hasPreview, activeTab]);

    const handleRunCode = () => {
        runCode(sessionId);
        setActiveTab('preview');
    };
    
    return (
        <>
            <div className="flex-1 flex flex-row h-full min-w-0 bg-[#0d1117]">
                <div className="w-56 shrink-0 h-full border-r" style={{borderColor: theme.colors.border}}>
                    <FileExplorer sessionId={sessionId} files={workspaceState.files} activeFileId={workspaceState.activeFileId} />
                </div>

                <div className="flex-grow flex flex-col h-full min-w-0" ref={mainPanelRef}>
                    <div style={{ height: `${editorHeight}%` }} className="flex flex-col min-h-0">
                        {activeFile ? (
                            <div className="flex flex-col flex-grow h-full min-w-0">
                                <div className="flex items-center justify-between p-2 border-b gap-2 flex-wrap" style={{backgroundColor: theme.colors.panelBg, borderColor: theme.colors.border}}>
                                    <div className="flex items-center gap-2">
                                        <button onClick={handleRunCode} disabled={isLoading} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-600/80 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50">
                                            <PlayIcon /> <span className="hidden md:inline">Run</span>
                                        </button>
                                        <select value={activeFile.language} onChange={(e) => updateCodeFile(sessionId, activeFile.id, activeFile.code, e.target.value)} className="bg-black/20 border-transparent rounded-md px-2 py-1 text-sm focus:ring-1" aria-label="Select language" style={{ color: theme.colors.textPrimary, '--tw-ring-color': theme.colors.accent } as React.CSSProperties}>
                                            {SUPPORTED_LANGUAGES.map(lang => <option key={lang.value} value={lang.value}>{lang.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <AiToolbarButton onClick={() => performAiCodeAction(sessionId, 'analyze')} icon={<AnalyzeIcon/>} label="Analyze" disabled={isLoading} />
                                        <AiToolbarButton onClick={() => performAiCodeAction(sessionId, 'refactor')} icon={<RefactorIcon/>} label="Refactor" disabled={isLoading || !activeFile} />
                                        <AiToolbarButton onClick={() => performAiCodeAction(sessionId, 'debug')} icon={<BugIcon/>} label="Debug" disabled={isLoading || !activeFile} />
                                        <AiToolbarButton onClick={() => performAiCodeAction(sessionId, 'document')} icon={<DocumentIcon/>} label="Document" disabled={isLoading || !activeFile} />
                                        <AiToolbarButton onClick={() => performAiCodeAction(sessionId, 'test')} icon={<TestIcon />} label="Tests" disabled={isLoading || !activeFile} />
                                    </div>
                                </div>
                                <textarea value={activeFile.code} onChange={(e) => updateCodeFile(sessionId, activeFile.id, e.target.value)} spellCheck="false" className="flex-grow w-full bg-[#010409] text-gray-300 p-4 font-mono text-sm resize-none focus:outline-none" placeholder="Write your code here..." />
                            </div>
                        ) : (
                            <div className="flex-grow flex flex-col items-center justify-center text-slate-600 p-4 text-center bg-[#010409]">
                            <CodeEditorIcon />
                                <p className="mt-4 text-lg font-medium">No file selected</p>
                                <p>Select a file from the workspace to begin editing.</p>
                            </div>
                        )}
                    </div>
                    <div onMouseDown={startVerticalDrag} className="w-full h-1.5 bg-slate-800 cursor-row-resize hover:bg-violet-500 transition-colors duration-200" title="Drag to resize"/>
                    <div style={{ height: `calc(100% - ${editorHeight}% - 6px)` }} className="flex flex-col min-h-0">
                        <div className="border-b shrink-0" style={{borderColor: theme.colors.border, backgroundColor: theme.colors.panelBg}}>
                            <div className="flex justify-between items-center">
                                <div className="flex">
                                    <button onClick={() => setActiveTab('preview')} className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'preview' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`} style={{borderColor: activeTab === 'preview' ? theme.colors.accent : 'transparent'}}><PreviewIcon/> Preview</button>
                                    <button onClick={() => setActiveTab('console')} className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'console' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`} style={{borderColor: activeTab === 'console' ? theme.colors.accent : 'transparent'}}><ConsoleIcon/> Console</button>
                                    <button onClick={() => setActiveTab('scratchpad')} className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'scratchpad' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`} style={{borderColor: activeTab === 'scratchpad' ? theme.colors.accent : 'transparent'}}><MagicWandIcon/> Scratchpad</button>
                                </div>
                                <div className="flex items-center mr-2">
                                  {activeTab === 'preview' && hasPreview && (
                                      <button onClick={() => setIsPreviewFullScreen(true)} className="flex items-center gap-1.5 text-xs px-2 py-1 rounded text-gray-300 hover:bg-white/10" title="Enter Full Screen">
                                          <FullscreenEnterIcon />
                                      </button>
                                  )}
                                  {activeTab === 'scratchpad' && widgets && widgets.length > 0 && (
                                    <button onClick={() => clearWidgets(sessionId)} className="flex items-center gap-1.5 text-xs px-2 py-1 rounded text-red-400 hover:bg-red-500/20" title="Clear Scratchpad">
                                        <TrashIcon /> <span className="hidden sm:inline">Clear</span>
                                    </button>
                                  )}
                                </div>
                            </div>
                        </div>
                        <div className="flex-grow overflow-auto bg-[#0d1117]">
                            {activeTab === 'console' && (
                            <pre className="p-4 text-xs font-mono h-full text-slate-400 whitespace-pre-wrap break-all">
                                {workspaceState.output || <span className="text-slate-600">Console output will appear here when you run your code.</span>}
                            </pre>
                            )}
                            {activeTab === 'preview' && (
                                workspaceState.previewHtml ? (
                                    <div className="w-full h-full checkerboard-bg p-1">
                                        <iframe title="Project Preview" srcDoc={workspaceState.previewHtml} sandbox="allow-scripts allow-modals allow-popups allow-same-origin" className="w-full h-full bg-white border-none rounded-sm shadow-lg"/>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-600">
                                        <PreviewIcon />
                                        <p className="mt-2">Click "Run" to see a preview of your project.</p>
                                    </div>
                                )
                            )}
                            {activeTab === 'scratchpad' && (
                                widgets && widgets.length > 0 ? (
                                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                      {widgets.map(widget => (
                                          <div key={widget.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                                              <WidgetRenderer jsx={widget.jsx} />
                                          </div>
                                      ))}
                                  </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-600">
                                        <MagicWandIcon/>
                                        <p className="mt-2">The Scratchpad is empty.</p>
                                        <p className="text-sm">Use <code className="bg-slate-700 px-1 py-0.5 rounded">/widget</code> in chat to generate live UI components.</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
                
                <div onMouseDown={startHorizontalDrag} className="w-1.5 bg-slate-800 cursor-col-resize hover:bg-violet-500 transition-colors duration-200 flex items-center justify-center relative shrink-0">
                    <button 
                        onClick={() => setIsChatCollapsed(!isChatCollapsed)} 
                        className="w-5 h-12 bg-slate-800 hover:bg-violet-600 rounded-l-md text-white flex items-center justify-center absolute left-0 -translate-x-full z-10 transition-colors"
                        title={isChatCollapsed ? "Show Chat" : "Hide Chat"}
                    >
                        {isChatCollapsed ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </button>
                </div>
                
                <div
                    className="shrink-0 h-full border-l overflow-hidden transition-all duration-300 flex flex-col"
                    style={{ width: isChatCollapsed ? '0px' : `${chatWidth}px`, borderColor: theme.colors.border }}
                >
                    {!isChatCollapsed && <AiChatPanel />}
                </div>
            </div>

            {isPreviewFullScreen && workspaceState.previewHtml && (
                <div className="fixed inset-0 z-[100] checkerboard-bg p-2 bg-[#0d1117]">
                    <iframe
                        title="Project Preview (Full Screen)"
                        srcDoc={workspaceState.previewHtml}
                        sandbox="allow-scripts allow-modals allow-popups allow-same-origin"
                        className="w-full h-full bg-white border-none rounded-sm shadow-lg"
                    />
                    <button
                        onClick={() => setIsPreviewFullScreen(false)}
                        className="absolute top-4 right-4 px-4 py-2 bg-slate-800/80 text-white rounded-lg hover:bg-slate-700 flex items-center gap-2"
                        title="Exit Full Screen"
                    >
                        <FullscreenExitIcon /> Exit Full Screen
                    </button>
                </div>
            )}
        </>
    );
};

export default CodeCanvas;