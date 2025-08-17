import React, { useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { MentorXProvider } from './context/NexusAIContext';
import { useMentorX } from './hooks/useNexusAI';
import RightPanel from './components/EvolutionTracker';
import ErrorBoundary from './components/ErrorBoundary';
import CommandPalette from './components/CommandPalette';
import { Settings } from './components/Settings';
import Dashboard from './components/Dashboard';

const DynamicStyles = () => {
    const { theme, appearanceSettings } = useMentorX();
    
    const cssVariables = useMemo(() => {
        const t = theme;
        // Map spacing presets to actual CSS values
        let spacingValues = {
          base: '1rem', sm: '0.875rem', xs: '0.75rem', lg: '1.25rem', xl: '1.5rem'
        };
        if (t.styles.spacing === '0.75rem') { // Compact
            spacingValues = { base: '0.75rem', sm: '0.625rem', xs: '0.5rem', lg: '1rem', xl: '1.25rem' };
        } else if (t.styles.spacing === '1.25rem') { // Spacious
            spacingValues = { base: '1.25rem', sm: '1rem', xs: '0.875rem', lg: '1.5rem', xl: '1.75rem' };
        }

        return `
:root {
    --color-app-bg: ${t.colors.appBg};
    --color-panel-bg: ${t.colors.panelBg};
    --color-text-primary: ${t.colors.textPrimary};
    --color-text-secondary: ${t.colors.textSecondary};
    --color-accent: ${t.colors.accent};
    --color-accent-text: ${t.colors.accentText};
    --color-accent-20: ${t.colors.accent}33; /* 20% opacity */
    --color-border: ${t.colors.border};
    --scrollbar-thumb-color: ${t.colors.scrollbarThumb};
    --font-family-ui: ${t.typography.fontFamily};
    --font-family-monospace: ${t.typography.monospaceFontFamily};
    --border-radius: ${t.styles.borderRadius};
    --spacing-base: ${spacingValues.base};
    --spacing-sm: ${spacingValues.sm};
    --spacing-xs: ${spacingValues.xs};
    --spacing-lg: ${spacingValues.lg};
    --spacing-xl: ${spacingValues.xl};
}
      `.trim();
    }, [theme]);
    
    return (
        <>
            <style>{cssVariables}</style>
            <style>{appearanceSettings.customCss}</style>
        </>
    );
};

const ThemedApp: React.FC = () => {
  const { 
      theme,
      appearanceSettings,
      showRightSidebar,
      showSidebar,
      isCommandPaletteOpen,
      setIsCommandPaletteOpen,
      isSettingsOpen,
      isFocusMode,
      activeSession,
      isUserDataLoading,
  } = useMentorX();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
            event.preventDefault();
            setIsCommandPaletteOpen(open => !open);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsCommandPaletteOpen]);
  
  const AppContent = () => {
    if (isUserDataLoading) {
      return (
          <div className="flex flex-col h-screen w-screen items-center justify-center bg-transparent text-white z-20">
              <svg className="animate-spin h-10 w-10 mb-4 text-violet-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <h1 className="text-2xl font-bold">Syncing Workspace...</h1>
              <p className="text-slate-400">Loading your chats and settings.</p>
          </div>
      );
    }

    const shouldShowSidebar = showSidebar && !isFocusMode;
    const shouldShowRightSidebar = showRightSidebar && !isFocusMode;

    if (isSettingsOpen) {
      return <Settings />;
    }

    return (
      <>
        {shouldShowSidebar && <Sidebar />}
        <div className="flex-1 flex h-full min-w-0">
          {activeSession ? <ChatWindow /> : <Dashboard />}
          {shouldShowRightSidebar && <RightPanel />}
        </div>
      </>
    );
  };
  
  return (
    <>
      <DynamicStyles />
      <div 
          className="relative h-screen w-screen overflow-hidden transition-colors duration-300"
          style={{ 
              backgroundColor: theme.colors.appBg === 'transparent' ? 'transparent' : 'var(--color-app-bg)',
              color: 'var(--color-text-primary)' 
          }}
      >
        {appearanceSettings.backgroundImage && (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-500 z-0"
            style={{
              backgroundImage: `url(${appearanceSettings.backgroundImage})`,
              opacity: appearanceSettings.backgroundOpacity / 100,
            }}
          />
        )}
        <div className={`relative z-10 flex h-full w-full ${theme.id === 'aurora' ? 'glassmorphism' : ''}`}
            style={{backgroundColor: theme.id === 'aurora' ? 'transparent' : 'var(--color-app-bg)'}}
        >
          <AppContent />
        </div>
      </div>
      {isCommandPaletteOpen && <CommandPalette />}
    </>
  );
}

const App: React.FC = () => {
  return (
    <MentorXProvider>
      <ErrorBoundary>
        <ThemedApp />
      </ErrorBoundary>
    </MentorXProvider>
  );
};

export default App;