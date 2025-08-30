import React from 'react';
import { useMentorX } from '../hooks/useNexusAI';
import { PlusIcon, TrashIcon, PencilIcon, ProIcon, MENTORX_PERSONAS, SettingsIcon, SidebarCollapseIcon, CommandIcon, resolvePersonaIcon } from '../constants';
import { ChatSession } from '../types';
import GoogleLogin from './GoogleLogin';

const groupSessionsByDate = (sessions: ChatSession[]) => {
  const groups: { [key: string]: ChatSession[] } = {
    "Today": [],
    "Yesterday": [],
    "Previous 7 Days": [],
    "Older": [],
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  sessions.forEach(session => {
    const sessionDate = new Date(session.createdAt);
    if (sessionDate >= today) {
      groups["Today"].push(session);
    } else if (sessionDate >= yesterday) {
      groups["Yesterday"].push(session);
    } else if (sessionDate >= sevenDaysAgo) {
      groups["Previous 7 Days"].push(session);
    } else {
      groups["Older"].push(session);
    }
  });

  return groups;
};

const SaveStatusIndicator: React.FC = () => {
    const { saveStatus, isSidebarCollapsed } = useMentorX();

    if (saveStatus === 'idle') {
        // To maintain layout consistency, render a placeholder with the same height
        return <div className="h-5"></div>;
    }

    return (
        <div className="flex items-center justify-center text-xs text-gray-500 h-5">
            {saveStatus === 'saving' && (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {!isSidebarCollapsed && <span>Syncing...</span>}
                </>
            )}
            {saveStatus === 'saved' && (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {!isSidebarCollapsed && <span>All changes saved</span>}
                </>
            )}
        </div>
    )
}

const UserProfile: React.FC = () => {
    const { user, logout, theme, isSidebarCollapsed } = useMentorX();

    if (isSidebarCollapsed) {
        return (
            <div className="flex justify-center items-center py-2">
                {user ? (
                     <img
                        src={user.picture}
                        alt={user.name}
                        className="h-10 w-10 rounded-full cursor-pointer"
                        title={`Logged in as ${user.name}\nClick to log out`}
                        onClick={logout}
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-400" title="Log in">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                )}
            </div>
        )
    }

    if (user) {
        return (
            <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3 min-w-0">
                    <img src={user.picture} alt={user.name} className="h-10 w-10 rounded-full"/>
                    <div className="min-w-0">
                        <p className="font-semibold text-sm truncate" style={{color: theme.colors.textPrimary}}>{user.name}</p>
                        <p className="text-xs truncate" style={{color: theme.colors.textSecondary}}>{user.email}</p>
                    </div>
                </div>
                <button onClick={logout} className="p-2 text-slate-400 hover:text-white shrink-0" title="Log out">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
                </button>
            </div>
        );
    }
    
    return (
        <div className="px-2 py-4 flex flex-col items-center gap-2 border-y my-2" style={{borderColor: theme.colors.border}}>
            <p className="text-sm font-semibold text-center">Log in to unlock Premium features</p>
            <GoogleLogin variant="sidebar" />
        </div>
    );
};

const Sidebar: React.FC = () => {
  const { 
    sessions, 
    activeSessionId, 
    setActiveSessionId, 
    deleteChat, 
    renameChat,
    isPremiumUser,
    searchQuery,
    setSearchQuery,
    isSidebarOpen,
    setIsSidebarOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    showSidebar,
    setIsCommandPaletteOpen,
    setIsSettingsOpen,
    customPersonas,
  } = useMentorX();
  const [editingSessionId, setEditingSessionId] = React.useState<string | null>(null);
  const [newTitle, setNewTitle] = React.useState('');
  
  const allPersonas = React.useMemo(() => [...MENTORX_PERSONAS, ...customPersonas], [customPersonas]);
  
  const displayedSessions = React.useMemo(() => {
    if (!searchQuery) return sessions;
    return sessions.filter(session => 
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.messages.some(msg => msg.text.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [sessions, searchQuery]);

  const groupedSessions = groupSessionsByDate(displayedSessions);

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation(); 
    if (window.confirm('Are you sure you want to delete this chat?')) {
        deleteChat(sessionId);
    }
  }

  const handleStartEditing = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setNewTitle(session.title);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if(editingSessionId && newTitle.trim()) {
      renameChat(editingSessionId, newTitle.trim());
    }
    setEditingSessionId(null);
    setNewTitle('');
  };
  
  const handleSessionClick = (sessionId: string) => {
    if (editingSessionId !== sessionId) {
        setActiveSessionId(sessionId);
        setIsSidebarOpen(false);
    }
  }

  const handleNewChatClick = () => {
    setActiveSessionId(null);
    setIsSidebarOpen(false);
  }

  const SearchBar = () => (
    <div className="relative mb-4 px-2 sm:px-0">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
        <input
          type="search"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={!isPremiumUser}
          className="w-full bg-black/20 border border-transparent rounded-lg py-2 pl-10 pr-4 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 disabled:bg-gray-800 disabled:cursor-not-allowed"
          style={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-border)', '--tw-ring-color': 'var(--color-accent)' } as React.CSSProperties}
        />
        {!isPremiumUser && 
          <div className="absolute right-2 top-1/2 -translate-y-1/2" title="Search is a Premium feature">
            <ProIcon />
          </div>
        }
      </div>
    </div>
  );

  const SessionItem = ({ session }: { session: ChatSession }) => {
      const persona = allPersonas.find(p => p.id === session.activePersonaId) || MENTORX_PERSONAS[0];
      
      return (
      <div
        key={session.id}
        className={`flex items-center justify-between w-full rounded-lg text-left group`}
        style={{
          backgroundColor: activeSessionId === session.id ? 'var(--color-accent-20)' : 'transparent'
        }}
      >
        <div
            role="button"
            tabIndex={0}
            onClick={() => handleSessionClick(session.id)}
            onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && editingSessionId !== session.id) {
                    e.preventDefault();
                    handleSessionClick(session.id)
                }
            }}
            className={`flex-1 flex items-center min-w-0 p-2.5 rounded-lg cursor-pointer transition-colors duration-200 ease-in-out hover:bg-white/5 ${
                activeSessionId === session.id ? 'text-white' : 'text-gray-400 hover:text-white'
            } ${isSidebarCollapsed ? 'justify-center' : ''}`}
            title={isSidebarCollapsed ? session.title : ''}
        >
            <div className={`shrink-0 h-5 w-5 flex items-center justify-center ${!isSidebarCollapsed ? 'mr-3' : ''}`}>{resolvePersonaIcon(persona.icon)}</div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                  {editingSessionId === session.id ? (
                    <form className="w-full" onSubmit={handleRenameSubmit}>
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onBlur={handleRenameSubmit}
                            autoFocus
                            className="bg-transparent border-b w-full outline-none text-white text-sm font-medium p-0"
                            style={{ borderColor: 'var(--color-accent)' }}
                            onClick={e => e.stopPropagation()}
                        />
                    </form>
                  ) : (
                      <p className="font-medium text-sm truncate" style={{ color: activeSessionId === session.id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>{session.title}</p>
                  )}
              </div>
            )}
        </div>
        
        {editingSessionId !== session.id && !isSidebarCollapsed && (
          <div className="flex items-center shrink-0 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(e) => handleStartEditing(e, session)} className="p-1 rounded-full text-gray-400 hover:text-white" aria-label="Rename chat">
                  <PencilIcon />
              </button>
              <button onClick={(e) => handleDelete(e, session.id)} className="p-1 rounded-full text-gray-400 hover:text-red-400" aria-label="Delete chat">
                  <TrashIcon />
              </button>
          </div>
        )}
      </div>
  )};

  if (!showSidebar) {
    return null;
  }

  return (
    <>
       {/* Mobile Overlay */}
        <div 
          className={`fixed inset-0 bg-black/50 z-20 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />

      <aside className={`fixed inset-y-0 left-0 z-30 p-2 flex flex-col shrink-0 border-r
        transform transition-all duration-300 ease-in-out lg:static lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isSidebarCollapsed ? 'w-20' : 'w-72'}`}
        style={{ backgroundColor: 'var(--color-panel-bg)', borderColor: 'var(--color-border)' }}
        >
        <div className={`flex items-center justify-between w-full mb-4 px-2 ${isSidebarCollapsed ? 'justify-center' : 'sm:justify-start'}`}>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-violet-500 rounded-lg flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="logo-m-path" d="M4 18V6L12 14L20 6V18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {!isSidebarCollapsed &&
              <h1 className="text-2xl xl:text-3xl font-bold ml-3 tracking-wide" style={{color: 'var(--color-text-primary)'}}>
                MentorX
              </h1>
            }
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className={`lg:hidden p-1 text-gray-400 hover:text-white ${isSidebarCollapsed ? 'hidden' : ''}`}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="px-2 sm:px-0">
          <button
              onClick={handleNewChatClick}
              data-tutorial-id="new-chat-button"
              className={`flex items-center justify-center w-full p-3 mb-4 rounded-lg hover:opacity-90 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2`}
               style={{ 
                   backgroundColor: 'var(--color-accent)', 
                   color: 'var(--color-accent-text)',
                   '--tw-ring-color': 'var(--color-accent)',
                   '--tw-ring-offset-color': 'var(--color-panel-bg)'
                } as React.CSSProperties}
                title={isSidebarCollapsed ? "New Chat" : ""}
          >
              <PlusIcon />
              {!isSidebarCollapsed && <span className="ml-2 font-semibold">New Chat</span>}
          </button>
        </div>

        {!isSidebarCollapsed && <SearchBar />}

        <nav className="flex-grow w-full flex flex-col gap-1 overflow-y-auto">
          {Object.entries(groupedSessions).map(([group, sessionsInGroup]) => (
              sessionsInGroup.length > 0 && (
                  <div key={group}>
                      {!isSidebarCollapsed && <span className="text-xs font-semibold uppercase tracking-wider mb-2 px-2 pt-2" style={{color: 'var(--color-text-secondary)'}}>{group}</span>}
                      {sessionsInGroup.map(session => <SessionItem key={session.id} session={session} />)}
                  </div>
              )
          ))}
           {displayedSessions.length === 0 && (
                <div className="text-center p-4 text-sm" style={{color: 'var(--color-text-secondary)'}}>
                    {!isSidebarCollapsed && (searchQuery ? "No chats found." : "No chat history.")}
                </div>
            )}
        </nav>

        <div className="mt-auto w-full pt-2 flex flex-col">
           <UserProfile />
           <div className="space-y-2 mt-2">
             <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="w-full hidden lg:flex items-center p-2 rounded-lg text-sm transition-colors" style={{ color: 'var(--color-text-secondary)' }}>
              <SidebarCollapseIcon />
              {!isSidebarCollapsed && <span className="ml-2">Collapse</span>}
            </button>
            <button onClick={() => setIsCommandPaletteOpen(true)} className="w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors" style={{ color: 'var(--color-text-secondary)' }}>
              <div className="flex items-center">
                  <CommandIcon />
                  {!isSidebarCollapsed && <span className="ml-2">Command Palette</span>}
              </div>
              {!isSidebarCollapsed && <kbd className="font-sans text-xs border rounded-md px-1.5 py-0.5" style={{borderColor: 'var(--color-border)'}}>Ctrl+K</kbd>}
            </button>
            <button data-tutorial-id="settings-button" onClick={() => setIsSettingsOpen(true)} className="w-full flex items-center p-2 rounded-lg text-sm transition-colors" style={{ color: 'var(--color-text-secondary)' }}>
              <SettingsIcon />
              {!isSidebarCollapsed && <span className="ml-2">Settings</span>}
            </button>
           </div>
          <div className="text-center mt-2">
            <SaveStatusIndicator />
            {!isSidebarCollapsed && <p className="text-xs" style={{color: 'var(--color-text-secondary)'}}>MentorX v1.3</p>}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;