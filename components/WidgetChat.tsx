import React, { useState, useCallback } from 'react';
import { useMentorX } from '../hooks/useNexusAI';
import { AiWidget } from '../types';
import { MagicWandIcon, TrashIcon, PinIcon } from '../constants';
import WidgetRenderer from './WidgetRenderer';
import AiChatPanel from './AiChatPanel';

const WidgetExplorer: React.FC<{
  sessionId: string;
  widgets: AiWidget[];
  activeWidgetId: string | null;
}> = React.memo(({ sessionId, widgets, activeWidgetId }) => {
  const { 
    setActiveWidgetId, 
    deleteWidget, 
    clearWidgets, 
    theme, 
    dashboardWidgetIds, 
    addWidgetToDashboard, 
    removeWidgetFromDashboard 
  } = useMentorX();

  return (
    <div className="w-full h-full p-2 flex flex-col" style={{backgroundColor: theme.colors.panelBg}}>
      <div className="flex justify-between items-center mb-2 p-1">
        <h3 className="text-sm font-bold uppercase tracking-wider" style={{color: theme.colors.textSecondary}}>Widgets</h3>
        <button 
            onClick={() => clearWidgets(sessionId)} 
            disabled={widgets.length === 0}
            className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50" 
            title="Clear All Widgets">
                <TrashIcon />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto space-y-1">
        {widgets.map(widget => {
          const isPinned = dashboardWidgetIds.includes(widget.id);
          return (
            <div
              key={widget.id}
              onClick={() => setActiveWidgetId(sessionId, widget.id)}
              className={`flex items-center justify-between w-full rounded-md text-left group text-sm cursor-pointer p-1.5
                ${activeWidgetId === widget.id ? 'text-white' : 'text-gray-400 hover:text-white'}`
              }
               style={{
                  backgroundColor: activeWidgetId === widget.id ? `${theme.colors.accent}20` : 'transparent'
               }}
            >
              <div className="flex items-center gap-2 flex-grow min-w-0">
                <MagicWandIcon />
                <span className="truncate" title={widget.prompt}>{widget.prompt}</span>
              </div>
              <div className="flex items-center shrink-0 pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isPinned) {
                        removeWidgetFromDashboard(widget.id);
                      } else {
                        addWidgetToDashboard(widget.id);
                      }
                    }}
                    className={`p-1 rounded-full hover:bg-white/10 ${isPinned ? 'text-violet-400' : 'text-gray-400'}`}
                    title={isPinned ? "Unpin from dashboard" : "Pin to dashboard"}
                  >
                    <PinIcon filled={isPinned} />
                  </button>
                  <button onClick={(e) => {e.stopPropagation(); deleteWidget(sessionId, widget.id);}} className="p-1 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-500/10" aria-label="Delete widget"><TrashIcon /></button>
              </div>
            </div>
          )
        })}
         {widgets.length === 0 && (
            <div className="text-center p-4 text-xs text-slate-500">
                No widgets created yet.
            </div>
         )}
      </div>
    </div>
  );
});


const WidgetChat: React.FC = () => {
    const { activeSession, theme } = useMentorX();
    
    // UI customization state
    const [chatWidth, setChatWidth] = useState(450);
    const [isChatCollapsed, setIsChatCollapsed] = useState(false);

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

    if (!activeSession || !activeSession.activePersonaId) return <div className="flex-1 flex items-center justify-center p-4"><p>Loading Widget Factory...</p></div>;
    
    const { id: sessionId, widgets = [], activeWidgetId } = activeSession;
    const activeWidget = widgets.find(w => w.id === activeWidgetId);
    
    return (
        <div className="flex-1 flex flex-row h-full min-w-0 bg-[#0d1117]">
            <div className="w-64 shrink-0 h-full border-r" style={{borderColor: theme.colors.border}}>
                <WidgetExplorer sessionId={sessionId} widgets={widgets} activeWidgetId={activeWidgetId} />
            </div>

            <div className="flex-grow flex flex-col h-full min-w-0 checkerboard-bg">
                {activeWidget ? (
                     <div className="w-full h-full p-4 overflow-auto flex items-center justify-center">
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 shadow-lg overflow-hidden p-4">
                            <WidgetRenderer jsx={activeWidget.jsx} />
                        </div>
                    </div>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-slate-500 p-4 text-center">
                        <MagicWandIcon />
                        <p className="mt-4 text-lg font-medium">No widget selected</p>
                        <p className="text-sm">Select a widget from the list or ask the AI to create one.</p>
                    </div>
                )}
            </div>
            
            <div onMouseDown={startHorizontalDrag} className="w-1.5 bg-slate-800 cursor-col-resize hover:bg-violet-500 transition-colors duration-200 flex items-center justify-center relative shrink-0" />
            
            <div
                className="shrink-0 h-full border-l overflow-hidden transition-all duration-300 flex flex-col"
                style={{ width: isChatCollapsed ? '0px' : `${chatWidth}px`, borderColor: theme.colors.border }}
            >
                {!isChatCollapsed && <AiChatPanel />}
            </div>
        </div>
    );
};

export default WidgetChat;