import React from 'react';
import { useMentorX } from '../hooks/useNexusAI';
import { MENTORX_PERSONAS, ProIcon, FeatherIcon, resolvePersonaIcon } from '../constants';

const Dashboard: React.FC = () => {
    const { startNewChat, isPremiumUser, theme, user } = useMentorX();

    const launchablePersonas = MENTORX_PERSONAS.filter(p => p.slogan);
    
    return (
        <main className="flex-1 flex flex-col items-center justify-center text-center p-4 sm:p-8 overflow-y-auto">
             <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-violet-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 18V6L12 14L20 6V18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{color: theme.colors.textPrimary}}>
                Welcome{user ? `, ${user.name.split(' ')[0]}` : ''}!
            </h1>
            <p className="text-lg mb-8" style={{ color: theme.colors.textSecondary }}>How can I help you today?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl w-full">
              {launchablePersonas.map((persona) => {
                  const isLocked = persona.isPro && !isPremiumUser;
                  return (
                    <div key={persona.id} className="relative group">
                      <button 
                        onClick={() => !isLocked && startNewChat(persona.id)}
                        disabled={isLocked}
                        className="p-5 rounded-lg text-left transition-all flex items-start gap-4 w-full h-full disabled:cursor-not-allowed disabled:opacity-60 group-hover:scale-105 group-hover:shadow-xl"
                        style={{ backgroundColor: 'var(--color-panel-bg)' }}
                      >
                        <div className="mt-1 shrink-0 h-8 w-8 flex items-center justify-center rounded-lg" style={{ color: theme.colors.accent, backgroundColor: `${theme.colors.accent}1A` }}>{resolvePersonaIcon(persona.icon)}</div>
                        <div>
                          <h3 className="font-semibold text-lg flex items-center" style={{ color: theme.colors.textPrimary }}>{persona.name}</h3>
                          <p className="text-sm" style={{ color: theme.colors.textSecondary }}>{persona.slogan}</p>
                        </div>
                      </button>
                      {isLocked && 
                        <div className="absolute top-3 right-3" title="This is a Premium feature">
                          <ProIcon />
                        </div>
                      }
                    </div>
                  );
              })}
            </div>
        </main>
    );
}

export default Dashboard;
