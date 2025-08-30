import React, { useState } from 'react';
import { useMentorX } from '../hooks/useNexusAI';
import { BrainIcon, TokenIcon, MagicWandIcon, TrashIcon, SKILL_ICONS } from '../constants';
import WidgetRenderer from './WidgetRenderer';
import { AiWidget } from '../types';

const SkillsPanel: React.FC = () => {
    const { evolutionState, stats, theme } = useMentorX();
    const totalLevel = Object.values(evolutionState).reduce((sum, skill) => sum + skill.level, 0);

    return (
        <>
            <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-xl font-bold" style={{color: theme.colors.textPrimary}}>Skill Matrix</h2>
                <p className="text-sm" style={{color: theme.colors.textSecondary}}>Rank <span className="font-bold text-lg" style={{color: theme.colors.accent}}>{totalLevel}</span></p>
            </div>
            
            <div className="space-y-4">
                {Object.values(evolutionState).map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center font-medium" style={{color: theme.colors.textPrimary}}>
                        <span className="mr-3" style={{color: theme.colors.textSecondary}}>{SKILL_ICONS[skill.id]}</span>
                        {skill.name}
                        </div>
                        <div className="text-right">
                            <p className="font-mono font-semibold" style={{color: theme.colors.textPrimary}}>LVL {skill.level}</p>
                            <p className="font-mono text-xs" style={{color: theme.colors.textSecondary}}>{skill.xp}/{skill.xpToNextLevel} XP</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t" style={{borderColor: theme.colors.border}}>
                <h3 className="text-lg font-bold mb-4" style={{color: theme.colors.textPrimary}}>Efficiency Stats</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center" style={{color: theme.colors.textPrimary}}>
                            <span className="mr-3" style={{color: theme.colors.accent}}><BrainIcon /></span>
                            API Calls Avoided
                        </div>
                        <p className="font-mono font-semibold" style={{color: theme.colors.textPrimary}}>{stats.apiCallsAvoided}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center" style={{color: theme.colors.textPrimary}}>
                            <span className="mr-3" style={{color: theme.colors.accent}}><TokenIcon /></span>
                            Tokens Saved
                        </div>
                        <p className="font-mono font-semibold" style={{color: theme.colors.textPrimary}}>~{stats.tokensSaved.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

const DashboardPanel: React.FC = () => {
    const { dashboardWidgetIds, sessions, removeWidgetFromDashboard, theme } = useMentorX();
    
    const findWidget = (widgetId: string): AiWidget | undefined => {
        for (const session of sessions) {
            const widget = session.widgets?.find(w => w.id === widgetId);
            if (widget) return widget;
        }
        return undefined;
    };

    const dashboardWidgets = dashboardWidgetIds.map(findWidget).filter(Boolean) as AiWidget[];

    if (dashboardWidgets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-4">
                <div className="p-3 bg-slate-700/50 rounded-full mb-4">
                    <MagicWandIcon />
                </div>
                <p className="font-semibold" style={{color: theme.colors.textPrimary}}>Dashboard is empty</p>
                <p className="text-xs max-w-xs" style={{color: theme.colors.textSecondary}}>
                    Go to the Widget Factory, create a component, and click the pin icon to add it here.
                </p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-2 gap-2">
            {dashboardWidgets.map(widget => (
                <div key={widget.id} className="rounded-lg border" style={{borderColor: theme.colors.border, backgroundColor: theme.colors.appBg}}>
                    <div className="p-1.5 flex justify-between items-center border-b" style={{borderColor: theme.colors.border}}>
                        <p className="text-xs font-semibold truncate" style={{color: theme.colors.textSecondary}} title={widget.prompt}>{widget.prompt}</p>
                        <button onClick={() => removeWidgetFromDashboard(widget.id)} className="p-1 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 shrink-0" title="Remove from dashboard">
                            <TrashIcon />
                        </button>
                    </div>
                    <div className="p-1.5">
                        <WidgetRenderer jsx={widget.jsx} />
                    </div>
                </div>
            ))}
        </div>
    );
};

const RightPanel: React.FC = () => {
  const { theme } = useMentorX();
  const [activeTab, setActiveTab] = useState<'skills' | 'dashboard'>('skills');

  return (
    <aside 
        data-tutorial-id="skill-matrix"
        className="w-80 p-4 hidden lg:flex flex-col shrink-0 border-l"
        style={{ backgroundColor: theme.colors.panelBg, borderColor: theme.colors.border }}
    >
        <div className="flex mb-4 p-1 rounded-lg" style={{backgroundColor: theme.colors.appBg}}>
            <button 
                onClick={() => setActiveTab('skills')} 
                className={`flex-1 text-sm font-semibold p-2 rounded-md transition-colors ${activeTab === 'skills' ? 'text-white' : 'text-gray-400'}`} 
                style={{backgroundColor: activeTab === 'skills' ? theme.colors.accent + '33' : 'transparent'}}
            >
                Skills
            </button>
            <button 
                onClick={() => setActiveTab('dashboard')} 
                className={`flex-1 text-sm font-semibold p-2 rounded-md transition-colors ${activeTab === 'dashboard' ? 'text-white' : 'text-gray-400'}`} 
                style={{backgroundColor: activeTab === 'dashboard' ? theme.colors.accent + '33' : 'transparent'}}
            >
                Dashboard
            </button>
        </div>
      
        <div className="flex-grow overflow-y-auto pr-2 -mr-4">
            {activeTab === 'skills' && <SkillsPanel />}
            {activeTab === 'dashboard' && <DashboardPanel />}
        </div>
       
        <div className="mt-6 pt-4 border-t text-center" style={{borderColor: theme.colors.border}}>
            <p className="text-sm text-green-400 flex items-center justify-center">
                <span className="h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                All systems nominal
            </p>
        </div>
    </aside>
  );
};

export default React.memo(RightPanel);