import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useMentorX } from '../hooks/useNexusAI';
import { COMMAND_PALETTE_COMMANDS } from '../constants';
import { CommandPaletteCommand } from '../types';

const CommandPalette: React.FC = () => {
    const { 
        setIsCommandPaletteOpen, 
        startNewChat,
        theme,
        isPremiumUser,
        setShowRightSidebar,
        setShowSidebar,
        setIsSettingsOpen,
        performAiCodeAction,
        activeSession,
        sendMessage,
    } = useMentorX();

    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    const filteredCommands = useMemo(() => {
        const baseCommands = COMMAND_PALETTE_COMMANDS.filter(cmd => {
            if ((cmd.action === 'perform_code_action' || cmd.action === 'generate_widget') && !activeSession?.workspaceState) {
                return false;
            }
            return !cmd.isPro || isPremiumUser;
        });

        if (!search) {
            return baseCommands;
        }
        
        const lowerCaseSearch = search.toLowerCase();
        return baseCommands.filter(cmd => 
            (cmd.title.toLowerCase().includes(lowerCaseSearch) || 
             cmd.keywords.toLowerCase().includes(lowerCaseSearch))
        );
    }, [search, isPremiumUser, activeSession]);

    const executeCommand = (command: CommandPaletteCommand) => {
        if (!command) return;

        switch(command.action) {
            case 'new_chat':
                startNewChat(command.personaId || 'default');
                break;
            case 'open_settings':
                setIsSettingsOpen(true);
                break;
            case 'toggle_sidebar':
                setShowSidebar(s => !s);
                break;
            case 'toggle_right_sidebar':
                setShowRightSidebar(s => !s);
                break;
            case 'perform_code_action':
                if (activeSession && command.codeAction) {
                    performAiCodeAction(activeSession.id, command.codeAction);
                }
                break;
            case 'generate_widget':
                const prompt = window.prompt("What UI widget would you like to generate?", "A real-time clock");
                if (prompt) {
                    sendMessage(`/widget ${prompt}`);
                }
                break;
        }
        setIsCommandPaletteOpen(false);
    };

    useEffect(() => {
        // Reset index when search changes
        setSelectedIndex(0);
    }, [search]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    executeCommand(filteredCommands[selectedIndex]);
                }
            } else if (e.key === 'Escape') {
                setIsCommandPaletteOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [filteredCommands, selectedIndex]);

    useEffect(() => {
        inputRef.current?.focus();
        // Scroll selected item into view
        resultsRef.current?.querySelector(`[data-index="${selectedIndex}"]`)?.scrollIntoView({
            block: 'nearest',
        });
    }, [selectedIndex]);

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-20" onClick={() => setIsCommandPaletteOpen(false)}>
            <div 
                className="w-full max-w-xl bg-[#1F2937] border rounded-xl shadow-2xl flex flex-col overflow-hidden" 
                style={{borderColor: theme.colors.border}} 
                onClick={e => e.stopPropagation()}
            >
                <div className="p-3 border-b flex items-center" style={{borderColor: theme.colors.border}}>
                     <svg className="h-5 w-5 text-gray-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type a command or search..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-transparent text-lg placeholder-gray-500 focus:outline-none"
                        style={{color: theme.colors.textPrimary}}
                    />
                </div>
                <div ref={resultsRef} className="max-h-96 overflow-y-auto p-2">
                    {filteredCommands.length > 0 ? (
                        Object.entries(
                            filteredCommands.reduce((acc, cmd) => {
                                (acc[cmd.category] = acc[cmd.category] || []).push(cmd);
                                return acc;
                            }, {} as Record<string, typeof filteredCommands>)
                        ).map(([category, commands]) => (
                            <div key={category}>
                                <h3 className="text-xs font-semibold uppercase px-3 pt-3 pb-1" style={{color: theme.colors.textSecondary}}>{category}</h3>
                                {commands.map((cmd) => {
                                    const globalIndex = filteredCommands.findIndex(c => c.id === cmd.id);
                                    return (
                                        <div
                                            key={cmd.id}
                                            data-index={globalIndex}
                                            onClick={() => executeCommand(cmd)}
                                            className={`flex items-center gap-3 p-3 rounded-md cursor-pointer text-sm ${selectedIndex === globalIndex ? 'text-white' : 'text-gray-300'}`}
                                            style={{backgroundColor: selectedIndex === globalIndex ? theme.colors.accent + '40' : 'transparent'}}
                                        >
                                            <span className="w-5 h-5 flex items-center justify-center" style={{color: selectedIndex === globalIndex ? theme.colors.accent : theme.colors.textSecondary}}>{cmd.icon}</span>
                                            <span className="font-medium">{cmd.title}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        ))
                    ) : (
                        <p className="p-4 text-center text-gray-500">No results found.</p>
                    )}
                </div>
                 <div className="p-2 border-t text-xs text-center" style={{borderColor: theme.colors.border, color: theme.colors.textSecondary}}>
                    Use <kbd className="font-sans border rounded-md px-1 py-0.5" style={{borderColor: 'var(--color-border)'}}>↑</kbd> <kbd className="font-sans border rounded-md px-1 py-0.5" style={{borderColor: 'var(--color-border)'}}>↓</kbd> to navigate, <kbd className="font-sans border rounded-md px-1 py-0.5" style={{borderColor: 'var(--color-border)'}}>Enter</kbd> to select.
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;