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
                                    <input id="temp" type="range" min="0" max="1" step="0.05" value={localModelParams.temperature ?? 0.7} onChange={e => setLocalModelParams(p => ({...p, temperature: parseFloat(e.target.value)}))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                                </div>
                                <div>
                                    <label htmlFor="topP" className="block text-sm font-medium" style={{color: 'var(--color-text-primary)'}}>Top P: <span className="font-mono">{localModelParams.topP?.toFixed(2) || 'N/A'}</span></label>
                                     <p className="text-xs mb-1" style={{color: 'var(--color-text-secondary)'}}>Controls nucleus sampling. Higher is more diverse.</p>
                                    <input id="topP" type="range" min="0" max="1" step="0.05" value={localModelParams.topP ?? 0.95} onChange={e => setLocalModelParams(p => ({...p, topP: parseFloat(e.target.value)}))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                                </div>
                                 <div>
                                    <label htmlFor="topK" className="block text-sm font-medium" style={{color: 'var(--color-text-primary)'}}>Top K: <span className="font-mono">{localModelParams.topK || 'N/A'}</span></label>
                                    <p className="text-xs mb-1" style={{color: 'var(--color-text-secondary)'}}>Limits sampling to K most likely tokens.</p>
                                    <input id="topK" type="range" min="1" max="100" step="1" value={localModelParams.topK ?? 40} onChange={e => setLocalModelParams(p => ({...p, topK: parseInt(e.target.value)}))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                                </div>
                            </fieldset>
                        </div>
                    </div>
                );
            case 'Personas':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-semibold" style={{color: 'var(--color-text-primary)'}}>Manage AI Personas</h4>
                            <button onClick={() => handleOpenPersonaEditor()} className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold hover:opacity-90" style={{backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)'}}><PlusIcon /> New Persona</button>
                        </div>
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                            {customPersonas.map(p => (
                                <div key={p.id} className="p-3 rounded-lg flex justify-between items-center" style={{backgroundColor: 'var(--color-app-bg)'}}>
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{renderIcon(p.icon)}</span>
                                        <div>
                                            <p className="font-bold">{p.name}</p>
                                            <p className="text-xs text-gray-400 truncate max-w-xs">{p.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleOpenPersonaEditor(p)} className="p-2 rounded-full hover:bg-white/10"><PencilIcon /></button>
                                        <button onClick={() => window.confirm(`Delete ${p.name}?`) && deleteCustomPersona(p.id)} className="p-2 rounded-full hover:bg-red-500/20 text-red-400"><TrashIcon /></button>
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
                           <div className="flex justify-between items-center mb-2">
                                <h4 className="text-lg font-semibold" style={{color: 'var(--color-text-primary)'}}>Theme</h4>
                                <button onClick={() => handleOpenThemeEditor()} className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold hover:opacity-90" style={{backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)'}}><PlusIcon /> New Theme</button>
                           </div>
                            <div className="flex gap-2 items-center">
                               <select value={localAppearance.activeThemeId} onChange={e => setLocalAppearance(p => ({...p, activeThemeId: e.target.value}))} className="w-full bg-black/20 p-2 rounded-md border border-slate-600 focus:ring-violet-500">
                                   <optgroup label="Default Themes">
                                    {THEME_OPTIONS.map(t => <option key={t.id} value={t.id} disabled={t.isPro && !isPremiumUser}>{t.name}{t.isPro && !isPremiumUser ? ' (Pro)' : ''}</option>)}
                                   </optgroup>
                                   {localAppearance.customThemes.length > 0 && <optgroup label="My Themes">
                                    {localAppearance.customThemes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                   </optgroup>}
                               </select>
                                <button onClick={() => handleOpenThemeEditor(allThemes.find(t => t.id === localAppearance.activeThemeId))} disabled={!allThemes.find(t => t.id === localAppearance.activeThemeId)?.isCustom} className="p-2 rounded-md hover:bg-white/10 disabled:opacity-50"><PencilIcon/></button>
                               <button onClick={() => window.confirm('Delete theme?') && deleteCustomTheme(localAppearance.activeThemeId)} disabled={!allThemes.find(t => t.id === localAppearance.activeThemeId)?.isCustom} className="p-2 rounded-md text-red-400 hover:bg-red-500/20 disabled:opacity-50"><TrashIcon/></button>
                           </div>
                       </div>
                        <div>
                            <label htmlFor="bg-image-url" className="block text-sm font-medium mb-2" style={{color: 'var(--color-text-primary)'}}>Background Image URL</label>
                            <input id="bg-image-url" type="url" value={localAppearance.backgroundImage} onChange={(e) => setLocalAppearance(p => ({...p, backgroundImage: e.target.value}))} placeholder="https://..." className="w-full border rounded-lg p-3 placeholder-gray-500 focus:outline-none focus:ring-2" style={{ backgroundColor: 'var(--color-app-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', '--tw-ring-color': 'var(--color-accent)' } as React.CSSProperties} />
                        </div>
                        <div>
                            <label htmlFor="bg-opacity" className="block text-sm font-medium mb-2" style={{color: 'var(--color-text-primary)'}}>Background Opacity: <span className="font-mono">{localAppearance.backgroundOpacity}%</span></label>
                            <input id="bg-opacity" type="range" min="0" max="100" step="5" value={localAppearance.backgroundOpacity} onChange={(e) => setLocalAppearance(p => ({...p, backgroundOpacity: parseInt(e.target.value, 10)}))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"/>
                        </div>
                    </div>
                );
            case 'Interface':
                return (
                    <div>
                         <h4 className="text-lg font-semibold mb-2" style={{color: 'var(--color-text-primary)'}}>UI Panels</h4>
                         <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg" style={{backgroundColor: 'var(--color-app-bg)'}}>
                                <label htmlFor="show-sidebar" className="font-medium">Show Left Panel (Chat History)</label>
                                <button onClick={() => setLocalShowSidebar(v => !v)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ${localShowSidebar ? 'bg-violet-500' : 'bg-slate-600'}`}>
                                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${ localShowSidebar ? 'translate-x-6' : 'translate-x-1' }`} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg" style={{backgroundColor: 'var(--color-app-bg)'}}>
                                <label htmlFor="show-tracker" className="font-medium">Show Right Panel</label>
                                <button onClick={() => setLocalShowRightSidebar(v => !v)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ${localShowRightSidebar ? 'bg-violet-500' : 'bg-slate-600'}`}>
                                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${ localShowRightSidebar ? 'translate-x-6' : 'translate-x-1' }`} />
                                </button>
                            </div>
                         </div>
                    </div>
                );
            case 'Advanced':
                 return (
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center mb-2">
                                <h4 className="text-lg font-semibold" style={{color: 'var(--color-text-primary)'}}>Global Custom Instructions</h4>
                            </div>
                            <p className="text-sm mb-4" style={{color: 'var(--color-text-secondary)'}}>Provide instructions for the AI to follow in all conversations.</p>
                            <textarea id="instruction" rows={5} value={localInstruction} onChange={(e) => setLocalInstruction(e.target.value)} placeholder="e.g., Always respond in Markdown. Be concise." className="w-full border rounded-lg p-3 placeholder-gray-500 focus:outline-none focus:ring-2" style={{ backgroundColor: 'var(--color-app-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', '--tw-ring-color': 'var(--color-accent)' } as React.CSSProperties} />
                        </div>
                        <div>
                            <div className="flex items-center mb-2">
                                <h4 className="text-lg font-semibold" style={{color: 'var(--color-text-primary)'}}>Custom CSS</h4>
                            </div>
                            <p className="text-sm mb-4" style={{color: 'var(--color-text-secondary)'}}>Power user mode: inject your own CSS rules. Use with caution.</p>
                            <textarea id="custom-css" rows={8} value={localAppearance.customCss} onChange={(e) => setLocalAppearance(p => ({...p, customCss: e.target.value}))} placeholder=".prose { font-size: 18px !important; }" className="w-full border rounded-lg p-3 placeholder-gray-500 focus:outline-none focus:ring-2 font-mono" style={{ backgroundColor: 'var(--color-app-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', '--tw-ring-color': 'var(--color-accent)' } as React.CSSProperties} />
                        </div>
                    </div>
                 )
            default:
                return null;
        }
    };
    
    const ThemeEditorModal = () => {
        if (!isThemeEditorOpen || !editingTheme) return null;
        
        const updateColor = (key: keyof Theme['colors'], value: string) => {
            setEditingTheme(t => t ? ({ ...t, colors: { ...t.colors, [key]: value } }) : null);
        };
        const updateTypography = (key: keyof Theme['typography'], value: string) => {
            setEditingTheme(t => t ? ({ ...t, typography: { ...t.typography, [key]: value } }) : null);
        };
        const updateStyle = (key: keyof Theme['styles'], value: string) => {
            setEditingTheme(t => t ? ({ ...t, styles: { ...t.styles, [key]: value } }) : null);
        };

        return (
            <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={() => setIsThemeEditorOpen(false)}>
                <div className="p-6 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]" style={{backgroundColor: 'var(--color-panel-bg)', borderColor: 'var(--color-border)', border: '1px solid'}} onClick={e => e.stopPropagation()}>
                    <h5 className="text-xl font-bold mb-4">{editingTheme.id ? "Edit" : "Create"} Theme</h5>
                    <div className="flex-grow overflow-y-auto pr-4 -mr-4 space-y-4">
                        <input type="text" value={editingTheme.name} onChange={e => setEditingTheme(t => t ? {...t, name: e.target.value} : null)} placeholder="Theme Name" className="w-full text-lg font-bold bg-transparent p-1 -ml-1 rounded-md focus:bg-black/20" />
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(editingTheme.colors).map(([key, value]) => (
                                <div key={key}>
                                    <label className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                                    <div className="flex items-center gap-2 mt-1 border border-slate-600 rounded-md p-1">
                                        <input type="color" value={value} onChange={e => updateColor(key as any, e.target.value)} className="w-8 h-8 rounded shrink-0 border-none bg-transparent" />
                                        <input type="text" value={value} onChange={e => updateColor(key as any, e.target.value)} className="w-full bg-transparent text-sm font-mono" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm">UI Font</label>
                                <select value={editingTheme.typography.fontFamily} onChange={e => updateTypography('fontFamily', e.target.value)} className="w-full mt-1 bg-black/20 p-2 rounded-md border border-slate-600">
                                    {GOOGLE_FONTS.filter(f=>f.type==='ui').map(f => <option key={f.name} value={f.value}>{f.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm">Code Font</label>
                                <select value={editingTheme.typography.monospaceFontFamily} onChange={e => updateTypography('monospaceFontFamily', e.target.value)} className="w-full mt-1 bg-black/20 p-2 rounded-md border border-slate-600">
                                    {GOOGLE_FONTS.filter(f=>f.type==='monospace').map(f => <option key={f.name} value={f.value}>{f.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm">Border Radius</label>
                                <select value={editingTheme.styles.borderRadius} onChange={e => updateStyle('borderRadius', e.target.value)} className="w-full mt-1 bg-black/20 p-2 rounded-md border border-slate-600">
                                    {BORDER_RADIUS_OPTIONS.map(o => <option key={o.name} value={o.value}>{o.name}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="text-sm">Spacing</label>
                                <select value={editingTheme.styles.spacing} onChange={e => updateStyle('spacing', e.target.value)} className="w-full mt-1 bg-black/20 p-2 rounded-md border border-slate-600">
                                    {SPACING_OPTIONS.map(o => <option key={o.name} value={o.value}>{o.name}</option>)}
                                </select>
                            </div>
                        </div>

                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setIsThemeEditorOpen(false)} className="px-4 py-2 rounded-lg bg-black/20">Cancel</button>
                        <button type="button" onClick={handleSaveTheme} className="px-4 py-2 rounded-lg" style={{backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)'}}>Save Theme</button>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setIsSettingsOpen(false)}>
            <div className="bg-[#1F2937] border rounded-xl shadow-2xl w-full max-w-5xl relative flex flex-col max-h-[90vh]" style={{ backgroundColor: 'var(--color-panel-bg)', borderColor: 'var(--color-border)' }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setIsSettingsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="p-6 border-b" style={{borderColor: 'var(--color-border)'}}>
                    <h2 className="text-2xl font-bold" style={{color: 'var(--color-text-primary)'}}>Settings</h2>
                </div>

                <div className="flex-grow flex min-h-0">
                    <aside className="w-48 p-4 border-r" style={{borderColor: 'var(--color-border)'}}>
                        <nav className="space-y-1">
                            {TABS.map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`} style={{backgroundColor: activeTab === tab ? 'var(--color-accent-20)' : 'transparent'}}>
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </aside>
                    <main className="flex-1 p-6 overflow-y-auto">
                        {renderTabContent()}
                    </main>
                </div>
                
                <div className="p-4 border-t flex justify-end gap-3 bg-black/10" style={{borderColor: 'var(--color-border)'}}>
                    <button type="button" onClick={() => setIsSettingsOpen(false)} className="px-5 py-2.5 rounded-lg bg-black/20 text-white font-semibold hover:bg-black/30 transition-colors">Cancel</button>
                    <button type="button" onClick={handleSave} className="px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-colors" style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}>Save Changes</button>
                </div>
            </div>
            {isPersonaEditorOpen && (
                <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={() => setIsPersonaEditorOpen(false)}>
                    <form onSubmit={handleSavePersona} className="p-6 rounded-xl shadow-2xl w-full max-w-lg space-y-4" style={{backgroundColor: 'var(--color-panel-bg)', borderColor: 'var(--color-border)', border: '1px solid'}} onClick={e => e.stopPropagation()}>
                        <h5 className="text-xl font-bold">{editingPersona?.id ? "Edit" : "Create"} Persona</h5>
                        <div>
                            <label htmlFor="p-name" className="text-sm font-medium">Name</label>
                            <input id="p-name" type="text" value={editingPersona?.name} onChange={e => setEditingPersona(p => ({...p!, name: e.target.value}))} required className="w-full mt-1 bg-black/20 p-2 rounded-md border border-slate-600 focus:ring-violet-500"/>
                        </div>
                        <div>
                            <label htmlFor="p-desc" className="text-sm font-medium">Description</label>
                            <input id="p-desc" type="text" value={editingPersona?.description} onChange={e => setEditingPersona(p => ({...p!, description: e.target.value}))} className="w-full mt-1 bg-black/20 p-2 rounded-md border border-slate-600"/>
                        </div>
                         <div>
                            <label htmlFor="p-prompt" className="text-sm font-medium">System Prompt</label>
                            <textarea id="p-prompt" rows={4} value={editingPersona?.system_prompt_segment} onChange={e => setEditingPersona(p => ({...p!, system_prompt_segment: e.target.value}))} required className="w-full mt-1 bg-black/20 p-2 rounded-md border border-slate-600"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Icon</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {CUSTOM_PERSONA_ICONS.map(i => (
                                    <button type="button" key={i.id} onClick={() => setEditingPersona(p => ({...p!, icon: i.id}))} className={`p-2 rounded-full border-2 ${editingPersona?.icon === i.id ? 'border-violet-500' : 'border-transparent'}`}>{i.icon}</button>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => setIsPersonaEditorOpen(false)} className="px-4 py-2 rounded-lg bg-black/20">Cancel</button>
                            <button type="submit" className="px-4 py-2 rounded-lg" style={{backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)'}}>Save Persona</button>
                        </div>
                    </form>
                </div>
            )}
            <ThemeEditorModal />
        </div>
    );
};

export default Settings;