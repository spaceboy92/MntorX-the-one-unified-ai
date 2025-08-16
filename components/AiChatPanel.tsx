import React, { useState, useEffect, useRef } from 'react';
import { useMentorX } from '../hooks/useNexusAI';
import { TaskStep } from '../types';
import { TasklistIcon, PlanIcon, ExecuteIcon } from '../constants';
import ChatMessageComponent from './ChatMessage';

const TaskStatusTracker: React.FC<{ onSuggestedActionClick: (action: string) => void }> = ({ onSuggestedActionClick }) => {
    const { activeSession, theme } = useMentorX();
    if (!activeSession?.activeTask) return null;

    const { activeTask } = activeSession;
    const { goal, plan, status, error } = activeTask;

    const StatusIcon = ({ status }: { status: TaskStep['status'] }) => {
        switch (status) {
            case 'pending':
                return <div className="h-4 w-4 rounded-full border-2 border-slate-500"></div>;
            case 'in-progress':
                return <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 border-t-transparent"></div>;
            case 'completed':
                return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
            case 'failed':
                return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
        }
    };

    return (
        <div className="p-3 border rounded-lg m-2" style={{backgroundColor: 'var(--color-app-bg)', borderColor: 'var(--color-border)'}}>
            <div className="flex items-start gap-3 mb-3">
                <span className="text-violet-400 mt-1"><TasklistIcon /></span>
                <div>
                    <h4 className="font-bold" style={{color: 'var(--color-text-primary)'}}>{status === 'planning' ? 'Planning Task' : 'Executing Task'}</h4>
                    <p className="text-sm" style={{color: 'var(--color-text-secondary)'}}>{goal}</p>
                </div>
            </div>
            
            {status === 'planning' && <div className="text-center text-sm text-gray-400">The AI is creating a plan...</div>}

            <div className="space-y-2">
                {plan.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-3 text-sm p-2 rounded-md" style={{backgroundColor: step.status === 'in-progress' ? `${theme.colors.accent}20` : 'transparent'}}>
                       <StatusIcon status={step.status} />
                       <span className={`flex-1 ${step.status === 'pending' ? 'text-gray-500' : ''}`} style={{color: step.status !== 'pending' ? 'var(--color-text-primary)' : ''}}>{step.description}</span>
                    </div>
                ))}
            </div>

            {status === 'completed' && <p className="text-center text-sm font-semibold text-green-500 mt-3">Task Completed Successfully!</p>}
            {status === 'failed' && <p className="text-center text-sm font-semibold text-red-500 mt-3">Task Failed: {error}</p>}
        </div>
    );
};

const AiChatPanel: React.FC = () => {
    const { activeSession, sendMessage, isLoading, theme, activePersona } = useMentorX();
    const [prompt, setPrompt] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    if (!activeSession || !activePersona) return null;

    const { messages, activeTask } = activeSession;
    const placeholderText = activePersona.placeholder || 'Ask the AI to do something...';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;

        if (activePersona.id === 'widget_factory' && !prompt.toLowerCase().startsWith('create') && !prompt.toLowerCase().startsWith('update')) {
             if (activeSession.activeWidgetId) {
                // This is a modification request for the active widget
                const activeWidget = activeSession.widgets?.find(w => w.id === activeSession.activeWidgetId);
                const newPrompt = activeWidget 
                    ? `Update the widget: '${activeWidget.prompt}' with the following change: '${prompt}'`
                    : `Could not find the active widget to update. Original request: ${prompt}`;
                const toolCallPrompt = `updateWidget({widgetId: "${activeSession.activeWidgetId}", newPrompt: "${activeWidget?.prompt}, ${prompt}"})`;
                sendMessage(toolCallPrompt);

             } else {
                // This is a creation request
                sendMessage(`createWidget({prompt: "${prompt}"})`);
             }
        } else {
            sendMessage(prompt, null);
        }

        setPrompt('');
    };
    
    const handleSuggestedAction = (action: string) => {
        const command = `/execute ${action}`;
        sendMessage(command, null);
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading, activeTask]);

    return (
        <div className="w-full h-full flex flex-col" style={{backgroundColor: theme.colors.panelBg}}>
             <div className="p-3 border-b flex items-center gap-3" style={{borderColor: theme.colors.border}}>
                <span className="text-violet-400"><PlanIcon /></span>
                <h3 className="text-lg font-bold" style={{color: theme.colors.textPrimary}}>AI Agent</h3>
            </div>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-2 sm:p-4">
                {messages.map((msg, index) => (
                    <ChatMessageComponent 
                        key={msg.id} 
                        message={msg} 
                        isLastAssistantMessage={msg.role === 'assistant' && index === messages.length -1 && !isLoading}
                        onSuggestedActionClick={handleSuggestedAction}
                    />
                ))}
                {activeTask && <TaskStatusTracker onSuggestedActionClick={handleSuggestedAction} />}
            </div>
            <div className="p-2 border-t" style={{borderColor: theme.colors.border}}>
                <form onSubmit={handleSubmit} className="relative flex items-end">
                    <textarea
                        ref={textareaRef}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
                        placeholder={placeholderText}
                        rows={1}
                        className="w-full bg-black/20 rounded-md text-gray-200 placeholder-gray-500 py-2 pl-3 pr-10 resize-none focus:outline-none focus:ring-2 transition-all max-h-32"
                        style={{'--tw-ring-color': theme.colors.accent} as React.CSSProperties}
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={!prompt.trim() || isLoading} className="absolute right-2 bottom-1.5 p-1.5 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all" aria-label="Send message" style={{ backgroundColor: theme.colors.accent }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AiChatPanel;