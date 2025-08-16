import React from 'react';
import { useMentorX } from '../hooks/useNexusAI';
import UnifiedChat from './UnifiedChat';
import CodeCanvas from './CodeCanvas';
import WidgetChat from './WidgetChat';
import Dashboard from './Dashboard';

const ChatWindow: React.FC = () => {
  const { 
    activeSession,
    activePersona,
  } = useMentorX();

  if (!activeSession) {
    return <Dashboard />;
  }
  
  // Render WidgetChat for the widget factory persona
  if (activePersona?.id === 'widget_factory') {
    return (
        <main className="flex-1 flex flex-col h-full min-w-0">
            <WidgetChat />
        </main>
    );
  }

  // Render CodeCanvas if the session has a workspace
  if (activeSession.workspaceState) {
    return (
      <main className="flex-1 flex flex-col h-full min-w-0">
        <CodeCanvas />
      </main>
    );
  }

  // Otherwise, render the standard chat UI
  return (
    <main className="flex-1 flex flex-col h-full min-w-0">
      <UnifiedChat />
    </main>
  );
};

export default ChatWindow;