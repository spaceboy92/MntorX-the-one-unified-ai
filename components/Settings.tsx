import React, { useState, useEffect, useMemo } from 'react';
import { useMentorX } from '../hooks/useNexusAI';
import { THEME_OPTIONS, CUSTOM_PERSONA_ICONS, TrashIcon, PencilIcon, PlusIcon, ProIcon, GeneralIcon, GOOGLE_FONTS, BORDER_RADIUS_OPTIONS, SPACING_OPTIONS } from '../constants';
import { AppearanceSettings, Persona, Theme } from '../types';

const TABS = ['AI Settings', 'Personas', 'Appearance', 'Interface', 'Advanced'];

export const Settings = () => {
    const { 
        activeSession,
        setSessionModelParams,
        customInstruction,
        setCustomInstruction,
        appearanceSettings,
        setAppearanceSettings,
        customPersonas,
        addCustomPersona,
        updateCustomPersona,
        deleteCustomPersona,
        showRightSidebar,
        setShowRightSidebar,
        showSidebar,
        setShowSidebar,
        isPremiumUser,
        addCustomTheme,
        updateCustomTheme,
        deleteCustomTheme,
        setIsSettingsOpen,
        startTutorial,
    } = useMentorX();

    const [activeTab, setActiveTab] = useState(TABS[0]);
    
    // Local state for pending changes
    const [localInstruction, setLocalInstruction] = useState(customInstruction);
    const [localAppearance, setLocalAppearance] = useState(appearanceSettings);
    const [localModelParams, setLocalModelParams] = useState({
        temperature: activeSession?.temperature,
        topP: activeSession?.topP,
        topK: activeSession?.topK,
    });
    const [localShowRightSidebar, setLocalShowRightSidebar] = useState(showRightSidebar);
    const [localShowSidebar, setLocalShowSidebar] = useState(showSidebar);

    // Persona editor state
    const [isPersonaEditorOpen, setIsPersonaEditorOpen] = useState(false);
    const [editingPersona, setEditingPersona] = useState<Partial<Persona> | null>(null);

    // Theme editor state
    const [isThemeEditorOpen, setIsThemeEditorOpen] = useState(false);
    const [editingTheme, setEditingTheme] = useState<Theme | null>(null);

    const allThemes = useMemo(() => [...THEME_OPTIONS, ...appearanceSettings.customThemes], [appearanceSettings.customThemes]);

    useEffect(() => {
        setLocalInstruction(customInstruction);
        setLocalAppearance(appearanceSettings);
        setLocalModelParams({
            temperature: activeSession?.temperature,
            topP: activeSession?.topP,
            topK: activeSession?.topK,
        });
        setLocalShowRightSidebar(showRightSidebar);
        setLocalShowSidebar(showSidebar);
    }, [customInstruction, appearanceSettings, activeSession, showRightSidebar, showSidebar]);


    const handleSave = () => {
        if (activeSession) {
            setSessionModelParams(activeSession.id, {
                temperature: localModelParams.temperature,
                topP: localModelParams.topP,
                topK: localModelParams.topK,
            });
        }
        setCustomInstruction(localInstruction);
        setAppearanceSettings(localAppearance);
        setShowRightSidebar(localShowRightSidebar);
        setShowSidebar(localShowSidebar);
        setIsSettingsOpen(false);
    };
    
    const handleOpenPersonaEditor = (persona: Partial<Persona> | null = null) => {
        setEditingPersona(persona || { name: '', description: '', system_prompt_segment: '', icon: 'robot' });
        setIsPersonaEditorOpen(true);
    };
    
    const handleSavePersona = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPersona?.name || !editingPersona?.system_prompt_segment) return;
        
        if (editingPersona.id) { // Update existing
            updateCustomPersona(editingPersona as Persona);
        } else { // Create new
            addCustomPersona(editingPersona as any);
        }
        setIsPersonaEditorOpen(false);
        setEditingPersona(null);
    };

    const handleOpenThemeEditor = (themeToEdit?: Theme) => {
        if (themeToEdit) {
            setEditingTheme(JSON.parse(JSON.stringify(themeToEdit))); // Deep copy
        } else { // Create new
            const newThemeBase = allThemes.find(t => t.id === 'default');
            setEditingTheme({
                ...(newThemeBase!),
                id: '',
                isCustom: true,
                name: 'My Custom Theme',
            });
        }
        setIsThemeEditorOpen(true);
    };
    
    const handleSaveTheme = () => {
        if (!editingTheme) return;
        if (editingTheme.id) { // Update
            updateCustomTheme(editingTheme);
        } else { // Create
            addCustomTheme(editingTheme);
        }
        setIsThemeEditorOpen(false);
        setEditingTheme(null);
    };

    const renderIcon = (icon: React.ReactNode | string | undefined) => {
        if (typeof icon !== 'string') return icon;
        return CUSTOM_PERSONA_ICONS.find(i => i.id === icon)?.icon || <GeneralIcon />;
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'AI Settings':
                return (
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-lg font-semibold mb-2" style={{color: 'var(--color-text-primary)'}}>Model Parameters (Current Session)</h4>
                            <p className="text-sm mb-4" style={{color: 'var(--color-text-secondary)'}}>Adjust the AI's behavior for this conversation. Changes apply to new messages.</p>
                            <fieldset disabled={!activeSession} className="space-y-4 disabled:opacity-50">
                                <div>
                                    <label htmlFor="temp" className="block text-sm font-medium" style={{color: 'var(--color-text-primary)'}}>Temperature: <span className="font-mono">{localModelParams.temperature?.toFixed(2) || 'N/A'}</span></label>
                                    <p className="text-xs mb-1" style={{color: 'var(--color-text-secondary)'}}>Controls randomness. Higher is more creative.</p>
                                    <input id="temp" type="range" min="0" max="1" step="0.05" value={localModelParams.temperature || 0.7} onChange={e => setLocalModelParams({...localModelParams, temperature: parseFloat(e.target.value)})} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                                </div>
                                <div>
                                    <label htmlFor="topP" className="block text-sm font-medium" style={{color: 'var(--color-text-primary)'}}>Top-P: <span className="font-mono">{localModelParams.topP?.toFixed(2) || 'N/A'}</span></label>
                                     <p className="text-xs mb-1" style={{color: 'var(--color-text-secondary)'}}>Filters tokens based on cumulative probability.</p>
                                    <input id="topP" type="range" min="0" max="1" step="0.05" value={localModelParams.topP || 0.95} onChange={e => setLocalModelParams({...localModelParams, topP: parseFloat(e.target.value)})} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                                </div>
                                {!activeSession && <p className="text-xs text-center text-yellow-400">Start a chat to edit model parameters.</p>}
                            </fieldset>
                        </div>
                        <div className="border-t pt-6" style={{borderColor: 'var(--color-border)'}}>
                            <h4 className="text-lg font-semibold mb-2" style={{color: 'var(--color-text-primary)'}}>Custom Instruction</h4>
                             <p className="text-sm mb-4" style={{color: 'var(--color-text-secondary)'}}>Provide a custom instruction that will be sent with every prompt to guide the AI's responses globally.</p>
                            <textarea
                                value={localInstruction}
                                onChange={e => setLocalInstruction(e.target.value)}
                                rows={5}
                                placeholder="e.g., Always respond in the style of a 1920s detective."
                                className="w-full bg-black/20 border rounded-lg p-3 text-sm focus:ring-1"
                                style={{borderColor: 'var(--color-border)', '--tw-ring-color': 'var(--color-accent)'} as React.CSSProperties}
                            />
                        </div>
                    </div>
                );
            case 'Personas':
                return (
                     <div>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h4 className="text-lg font-semibold" style={{color: 'var(--color-text-primary)'}}>Manage Personas</h4>
                                <p className="text-sm" style={{color: 'var(--color-text-secondary)'}}>Create or edit custom AI personas for specialized tasks.</p>
                            </div>
                            <button onClick={() => handleOpenPersonaEditor()} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg" style={{backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)'}}>
                                <PlusIcon /> New Persona
                            </button>
                        </div>
                        <div className="space-y-2">
                            {customPersonas.map(persona => (
                                <div key={persona.id} className="p-3 rounded-lg flex justify-between items-start" style={{backgroundColor: 'var(--color-panel-bg)'}}>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 flex items-center justify-center rounded-md text-xl shrink-0" style={{color: 'var(--color-accent)'}}>{renderIcon(persona.icon)}</div>
                                        <div>
                                            <h5 className="font-semibold" style={{color: 'var(--color-text-primary)'}}>{persona.name}</h5>
                                            <p className="text-xs" style={{color: 'var(--color-text-secondary)'}}>{persona.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleOpenPersonaEditor(persona)} className="p-2 text-gray-400 hover:text-white"><PencilIcon /></button>
                                        <button onClick={() => deleteCustomPersona(persona.id)} className="p-2 text-gray-400 hover:text-red-400"><TrashIcon /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'Appearance':
                return (
                     <div className="space-y-6">
                        <div>
                            <h4 className="text-lg font-semibold mb-3" style={{color: 'var(--color-text-primary)'}}>Theme</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {allThemes.map(theme => (
                                    <div key={theme.id} className="relative">
                                        <button onClick={() => setLocalAppearance(prev => ({...prev, activeThemeId: theme.id}))} className={`w-full p-2 border-2 rounded-lg ${localAppearance.activeThemeId === theme.id ? '' : 'border-transparent'}`} style={{borderColor: localAppearance.activeThemeId === theme.id ? 'var(--color-accent)' : 'transparent'}}>
                                            <div className="w-full aspect-video rounded-md flex items-center justify-center text-xs font-bold" style={{backgroundColor: theme.colors.panelBg, color: theme.colors.accentText, border: `1px solid ${theme.colors.border}`}}>
                                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: theme.colors.accent}}></div>
                                            </div>
                                            <p className="mt-2 text-sm font-medium text-center">{theme.name}</p>
                                        </button>
                                        {theme.isPro && !isPremiumUser && <div className="absolute top-1 right-1"><ProIcon/></div>}
                                        {theme.isCustom && (
                                             <div className="absolute top-1 right-1 flex gap-1">
                                                <button onClick={() => handleOpenThemeEditor(theme)} className="p-1 bg-slate-800/80 rounded-full text-slate-300 hover:text-white"><PencilIcon /></button>
                                                <button onClick={() => deleteCustomTheme(theme.id)} className="p-1 bg-slate-800/80 rounded-full text-slate-300 hover:text-red-400"><TrashIcon /></button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                             <button onClick={() => handleOpenThemeEditor()} className="mt-4 flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg" style={{backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)'}}>
                                <PlusIcon /> New Theme
                            </button>
                        </div>
                        <div className="border-t pt-6" style={{borderColor: 'var(--color-border)'}}>
                            <h4 className="text-lg font-semibold mb-3" style={{color: 'var(--color-text-primary)'}}>Deep Customization</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">UI Font</label>
                                    <select value={localAppearance.customThemes.find(t=>t.id === localAppearance.activeThemeId)?.typography.fontFamily || THEME_OPTIONS[0].typography.fontFamily} onChange={e => console.log('Font change not implemented for custom themes yet')} className="w-full bg-black/20 border rounded-lg p-2 text-sm" style={{borderColor: 'var(--color-border)'}}>
                                        {GOOGLE_FONTS.filter(f => f.type === 'ui').map(f => <option key={f.name} value={f.value}>{f.name}</option>)}
                                    </select>
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium mb-2">Monospace Font</label>
                                    <select className="w-full bg-black/20 border rounded-lg p-2 text-sm" style={{borderColor: 'var(--color-border)'}}>
                                        {GOOGLE_FONTS.filter(f => f.type === 'monospace').map(f => <option key={f.name} value={f.value}>{f.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Border Radius</label>
                                     <select className="w-full bg-black/20 border rounded-lg p-2 text-sm" style={{borderColor: 'var(--color-border)'}}>
                                        {BORDER_RADIUS_OPTIONS.map(o => <option key={o.name} value={o.value}>{o.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Spacing</label>
                                     <select className="w-full bg-black/20 border rounded-lg p-2 text-sm" style={{borderColor: 'var(--color-border)'}}>
                                        {SPACING_OPTIONS.map(o => <option key={o.name} value={o.value}>{o.name}</option>)}
                                    </select>
                                </div>
                             </div>
                        </div>

                        <div className="border-t pt-6" style={{borderColor: 'var(--color-border)'}}>
                            <h4 className="text-lg font-semibold mb-3" style={{color: 'var(--color-text-primary)'}}>Background</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="bgUrl" className="block text-sm font-medium mb-1">Image URL</label>
                                    <input id="bgUrl" type="text" value={localAppearance.backgroundImage} onChange={e => setLocalAppearance({...localAppearance, backgroundImage: e.target.value})} placeholder="https://..." className="w-full bg-black/20 border rounded-lg p-2 text-sm" style={{borderColor: 'var(--color-border)'}}/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Opacity: <span className="font-mono">{localAppearance.backgroundOpacity}%</span></label>
                                    <input type="range" min="0" max="100" value={localAppearance.backgroundOpacity} onChange={e => setLocalAppearance({...localAppearance, backgroundOpacity: parseInt(e.target.value)})} className="w-full"/>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Interface':
                 return (
                     <div className="space-y-6">
                        <div>
                            <h4 className="text-lg font-semibold mb-3" style={{color: 'var(--color-text-primary)'}}>Layout</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-lg" style={{backgroundColor: 'var(--color-panel-bg)'}}>
                                    <label htmlFor="show-main-sidebar" className="font-medium">Show Main Sidebar</label>
                                    <input id="show-main-sidebar" type="checkbox" checked={localShowSidebar} onChange={e => setLocalShowSidebar(e.target.checked)} className="h-5 w-5 rounded text-violet-500 focus:ring-violet-500" style={{backgroundColor: 'var(--color-panel-bg)', borderColor: 'var(--color-border)'}}/>
                                </div>
                                 <div className="flex items-center justify-between p-3 rounded-lg" style={{backgroundColor: 'var(--color-panel-bg)'}}>
                                    <label htmlFor="show-right-panel" className="font-medium">Show Skills & Dashboard Panel</label>
                                    <input id="show-right-panel" type="checkbox" checked={localShowRightSidebar} onChange={e => setLocalShowRightSidebar(e.target.checked)} className="h-5 w-5 rounded text-violet-500 focus:ring-violet-500" style={{backgroundColor: 'var(--color-panel-bg)', borderColor: 'var(--color-border)'}}/>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Advanced':
                return (
                     <div className="space-y-6">
                        <div>
                            <h4 className="text-lg font-semibold mb-2" style={{color: 'var(--color-text-primary)'}}>Custom CSS</h4>
                            <p className="text-sm mb-4" style={{color: 'var(--color-text-secondary)'}}>Apply your own CSS rules to the application. Use with caution.</p>
                             <textarea
                                value={localAppearance.customCss}
                                onChange={e => setLocalAppearance({...localAppearance, customCss: e.target.value})}
                                rows={10}
                                placeholder="/* Your custom CSS here */"
                                className="w-full bg-black/20 border rounded-lg p-3 text-sm font-mono focus:ring-1"
                                style={{borderColor: 'var(--color-border)', '--tw-ring-color': 'var(--color-accent)'} as React.CSSProperties}
                            />
                        </div>
                        <div className="border-t pt-6" style={{borderColor: 'var(--color-border)'}}>
                            <h4 className="text-lg font-semibold mb-2" style={{color: 'var(--color-text-primary)'}}>Tutorial</h4>
                            <p className="text-sm mb-4" style={{color: 'var(--color-text-secondary)'}}>Replay the introductory tutorial to get a tour of MentorX's features.</p>
                            <button onClick={() => { setIsSettingsOpen(false); startTutorial(); }} className="px-4 py-2 text-sm font-semibold rounded-lg" style={{backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)'}}>
                                Restart Tutorial
                            </button>
                        </div>
                    </div>
                )
            default:
                return null;
        }
    };
// FIX: Added the main return statement for the Settings component JSX.
return (
    <div className="fixed inset-0 z-40 flex flex-col" style={{backgroundColor: 'var(--color-app-bg)'}}>
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b shrink-0" style={{borderColor: 'var(--color-border)'}}>
            <h2 className="text-2xl font-bold" style={{color: 'var(--color-text-primary)'}}>Settings</h2>
            <div className="flex items-center gap-2">
                <button onClick={() => setIsSettingsOpen(false)} className="px-4 py-2 text-sm rounded-lg hover:bg-white/10">
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-semibold rounded-lg"
                    style={{backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)'}}
                >
                    Save & Close
                </button>
            </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 min-h-0">
            {/* Tabs Sidebar */}
            <aside className="w-56 p-4 border-r shrink-0" style={{borderColor: 'var(--color-border)'}}>
                <nav className="space-y-1">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-white'
                            }`}
                            style={{backgroundColor: activeTab === tab ? 'var(--color-accent-20)' : 'transparent'}}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Tab Panel */}
            <main className="flex-1 p-6 overflow-y-auto">
                {renderTabContent()}
            </main>
        </div>

        {/* Persona Editor Modal */}
        {isPersonaEditorOpen && editingPersona && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div className="bg-[#1F2937] border rounded-xl shadow-2xl w-full max-w-2xl" style={{borderColor: 'var(--color-border)'}} onClick={e => e.stopPropagation()}>
                    <form onSubmit={handleSavePersona}>
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-4">{editingPersona.id ? 'Edit' : 'Create'} Persona</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="persona-name" className="block text-sm font-medium mb-1">Name</label>
                                    <input id="persona-name" type="text" value={editingPersona.name || ''} onChange={e => setEditingPersona({...editingPersona, name: e.target.value})} required className="w-full bg-[#111827] border border-slate-600 rounded-lg p-2 focus:ring-violet-500 focus:border-violet-500"/>
                                </div>
                                <div>
                                    <label htmlFor="persona-desc" className="block text-sm font-medium mb-1">Slogan / Short Description</label>
                                    <input id="persona-desc" type="text" value={editingPersona.description || ''} onChange={e => setEditingPersona({...editingPersona, description: e.target.value})} placeholder="e.g., Your expert on ancient history" className="w-full bg-[#111827] border border-slate-600 rounded-lg p-2 focus:ring-violet-500 focus:border-violet-500"/>
                                </div>
                                <div>
                                    <label htmlFor="persona-prompt" className="block text-sm font-medium mb-1">System Prompt</label>
                                    <textarea id="persona-prompt" rows={5} value={editingPersona.system_prompt_segment || ''} onChange={e => setEditingPersona({...editingPersona, system_prompt_segment: e.target.value})} required className="w-full bg-[#111827] border border-slate-600 rounded-lg p-2 focus:ring-violet-500 focus:border-violet-500"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Icon</label>
                                    <div className="flex flex-wrap gap-2">
                                        {CUSTOM_PERSONA_ICONS.map(icon => (
                                            <button key={icon.id} type="button" onClick={() => setEditingPersona({...editingPersona, icon: icon.id})} className={`p-2 rounded-lg border-2 ${editingPersona.icon === icon.id ? 'border-violet-500' : 'border-transparent'}`}>
                                                {icon.icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-black/20 border-t flex justify-end gap-2" style={{borderColor: 'var(--color-border)'}}>
                            <button type="button" onClick={() => setIsPersonaEditorOpen(false)} className="px-4 py-2 text-sm rounded-lg hover:bg-white/10">Cancel</button>
                            <button type="submit" className="px-4 py-2 text-sm font-semibold rounded-lg" style={{backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)'}}>Save Persona</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        
        {/* Theme Editor Modal */}
        {isThemeEditorOpen && editingTheme && (
             <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div className="bg-[#1F2937] border rounded-xl shadow-2xl w-full max-w-4xl" style={{borderColor: 'var(--color-border)'}} onClick={e => e.stopPropagation()}>
                    <div className="p-6 border-b" style={{borderColor: 'var(--color-border)'}}>
                        <h3 className="text-xl font-bold">{editingTheme.id ? 'Edit' : 'Create'} Theme</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Theme Name</label>
                                <input type="text" value={editingTheme.name} onChange={e => setEditingTheme({...editingTheme, name: e.target.value})} className="w-full bg-[#111827] border border-slate-600 rounded-lg p-2 focus:ring-violet-500 focus:border-violet-500" />
                            </div>
                            <h4 className="text-md font-semibold pt-2">Colors</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(editingTheme.colors).map(([key, value]) => (
                                    <div key={key}>
                                        <label className="block text-xs font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <input type="color" value={value} onChange={e => setEditingTheme({...editingTheme, colors: {...editingTheme.colors, [key]: e.target.value}})} className="h-8 w-8 p-0 border-none rounded cursor-pointer bg-transparent" />
                                            <input type="text" value={value} onChange={e => setEditingTheme({...editingTheme, colors: {...editingTheme.colors, [key]: e.target.value}})} className="w-full bg-[#111827] border border-slate-600 rounded-md p-1 text-xs" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 bg-black/20">
                            <h4 className="text-md font-semibold mb-4">Preview</h4>
                            <div className="p-4 rounded-lg" style={{backgroundColor: editingTheme.colors.appBg, border: `1px solid ${editingTheme.colors.border}`}}>
                                <div className="p-4 rounded-md" style={{backgroundColor: editingTheme.colors.panelBg}}>
                                    <h5 className="font-bold" style={{color: editingTheme.colors.textPrimary}}>Primary Text</h5>
                                    <p className="text-sm" style={{color: editingTheme.colors.textSecondary}}>Secondary text for descriptions.</p>
                                    <button className="px-3 py-1 mt-2 text-sm font-semibold rounded" style={{backgroundColor: editingTheme.colors.accent, color: editingTheme.colors.accentText}}>Accent Button</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-black/20 border-t flex justify-end gap-2" style={{borderColor: 'var(--color-border)'}}>
                        <button type="button" onClick={() => setIsThemeEditorOpen(false)} className="px-4 py-2 text-sm rounded-lg hover:bg-white/10">Cancel</button>
                        <button type="button" onClick={handleSaveTheme} className="px-4 py-2 text-sm font-semibold rounded-lg" style={{backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)'}}>Save Theme</button>
                    </div>
                </div>
            </div>
        )}
    </div>
);
};
