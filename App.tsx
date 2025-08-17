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

const ConfigurationErrorScreen: React.FC<{ message: string }> = ({ message }) => {
    return (
        <div className="flex flex-col h-screen w-screen items-center justify-center bg-[#111827] text-white p-8 text-center">
            <div className="inline-block bg-red-500/20 p-4 rounded-full mb-6 text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.22 3.001-1.742 3.001H4.42c-1.522 0-2.492-1.667-1.742-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            </div>
            <h1 className="text-3xl font-bold text-red-400 mb-2">Configuration Required</h1>
            <p className="text-lg text-gray-400 mb-6 max-w-2xl">
                The application cannot connect to Google's AI services because it is not configured correctly.
            </p>
            <div className="my-4 p-4 bg-slate-900/50 rounded-lg text-left max-w-2xl mx-auto border border-slate-700">
                <p className="font-semibold text-gray-300">Error Details:</p>
                <pre className="text-sm text-red-300/80 whitespace-pre-wrap mt-2 font-mono">
                    {message}
                </pre>
                 <p className="text-xs text-gray-500 mt-4">
                    If you are the developer, please ensure the <code className="bg-slate-700 px-1 py-0.5 rounded">API_KEY</code> environment variable is set correctly in your deployment environment.
                </p>
            </div>
        </div>
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
      user,
      configError,
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
  
  if (configError) {
      return <ConfigurationErrorScreen message={configError} />;
  }

  if (isUserDataLoading && user) {
    return (
        <div className="flex flex-col h-screen w-screen items-center justify-center bg-[#111827] text-white">
            <svg className="animate-spin h-10 w-10 mb-4 text-violet-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h1 className="text-2xl font-bold">Syncing Workspace...</h1>
            <p className="text-slate-400">Loading your chats and settings from the cloud.</p>
        </div>
    );
  }

  const shouldShowSidebar = showSidebar && !isFocusMode;
  const shouldShowRightSidebar = showRightSidebar && !isFocusMode;

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
          {isSettingsOpen ? (
            <Settings />
          ) : (
            <>
              {shouldShowSidebar && <Sidebar />}
              <div className="flex-1 flex h-full min-w-0">
                {activeSession ? <ChatWindow /> : <Dashboard />}
                {shouldShowRightSidebar && <RightPanel />}
              </div>
            </>
          )}
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