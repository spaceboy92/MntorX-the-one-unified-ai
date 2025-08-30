import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useMentorX } from '../hooks/useNexusAI';

const TUTORIAL_STEPS = [
  {
    id: 'persona-cards',
    title: 'Welcome to MentorX!',
    text: "This is your dashboard. You can start a new chat by selecting one of our specialized AI personas.",
    position: 'bottom',
  },
  {
    id: 'new-chat-button',
    title: 'Start a New Chat',
    text: "Click here any time to begin a new conversation with the default MentorX persona.",
    position: 'right',
  },
  {
    id: 'prompt-bar',
    title: 'The Prompt Bar',
    text: "This is where you'll interact with the AI. Type your questions, attach files, or use voice input.",
    position: 'top',
  },
  {
    id: 'chat-header-toggles',
    title: 'Conversation Controls',
    text: "Enhance your chat with live web access for up-to-date information or enable Deep Analysis for more expert-level responses.",
    position: 'bottom',
  },
  {
    id: 'skill-matrix',
    title: 'Your AI\'s Evolution',
    text: "As you interact with MentorX, its skills will grow. Track its progress and your efficiency stats here.",
    position: 'left',
  },
  {
    id: 'settings-button',
    title: 'Customize Your Experience',
    text: "Finally, open the settings to customize themes, create your own AI personas, and more. Enjoy exploring MentorX!",
    position: 'right',
  }
];

const Tutorial: React.FC = () => {
    const { tutorialStep, nextTutorialStep, prevTutorialStep, endTutorial, activeSessionId, setActiveSessionId, startNewChat } = useMentorX();
    const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({ opacity: 0 });
    const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({ opacity: 0 });
    const [currentStepConfig, setCurrentStepConfig] = useState(TUTORIAL_STEPS[0]);

    // This effect ensures the app is in the right state for the tutorial step.
    useEffect(() => {
        const step = TUTORIAL_STEPS[tutorialStep];
        if (!step) {
            endTutorial();
            return;
        }

        const needsDashboard = ['persona-cards'].includes(step.id);
        const needsChat = ['prompt-bar', 'chat-header-toggles'].includes(step.id);

        if (needsDashboard && activeSessionId) {
            setActiveSessionId(null);
        } else if (needsChat && !activeSessionId) {
            // Automatically start a chat to show chat-related features
            startNewChat('default');
        }
    }, [tutorialStep, activeSessionId, setActiveSessionId, startNewChat, endTutorial]);
    
    useLayoutEffect(() => {
        const step = TUTORIAL_STEPS[tutorialStep];
        if (!step) return;

        let customText = step.text;
        const targetElement = document.querySelector(`[data-tutorial-id="${step.id}"]`) as HTMLElement;
        
        if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            const PADDING = 10;
            
            setHighlightStyle({
                width: `${rect.width + PADDING}px`,
                height: `${rect.height + PADDING}px`,
                top: `${rect.top - PADDING / 2}px`,
                left: `${rect.left - PADDING / 2}px`,
                opacity: 1,
            });

            const tooltipPos: React.CSSProperties = { opacity: 1 };
            const tooltipWidth = 320; // Corresponds to w-80

            if (step.position === 'bottom') {
                tooltipPos.top = `${rect.bottom + PADDING}px`;
                tooltipPos.left = `${rect.left + rect.width / 2}px`;
                tooltipPos.transform = 'translateX(-50%)';
            } else if (step.position === 'top') {
                tooltipPos.top = `${rect.top - PADDING}px`;
                tooltipPos.left = `${rect.left + rect.width / 2}px`;
                tooltipPos.transform = 'translate(-50%, -100%)';
            } else if (step.position === 'left') {
                tooltipPos.top = `${rect.top + rect.height / 2}px`;
                tooltipPos.left = `${rect.left - PADDING}px`;
                tooltipPos.transform = 'translate(-100%, -50%)';
            } else { // right
                tooltipPos.top = `${rect.top + rect.height / 2}px`;
                tooltipPos.left = `${rect.right + PADDING}px`;
                tooltipPos.transform = 'translateY(-50%)';
            }

            // Boundary checks
            // FIX: The original cast `as number` was incorrect because tooltipPos.left is a string like "123px".
            // We now correctly parse the string to a number before performing arithmetic operations.
            if (tooltipPos.left) {
                const numericLeft = parseInt(String(tooltipPos.left), 10);
                const effectiveLeft = tooltipPos.transform?.includes('translateX(-50%)') ? numericLeft - tooltipWidth / 2 : numericLeft;
                
                if (effectiveLeft + tooltipWidth > window.innerWidth) {
                    tooltipPos.left = `${window.innerWidth - tooltipWidth - PADDING}px`;
                    if (tooltipPos.transform) {
                        tooltipPos.transform = tooltipPos.transform.toString().replace(/translateX\([^)]+\)/, '');
                    }
                }
                if (effectiveLeft < PADDING) {
                    tooltipPos.left = `${PADDING}px`;
                     if (tooltipPos.transform) {
                        tooltipPos.transform = tooltipPos.transform.toString().replace(/translateX\([^)]+\)/, '');
                    }
                }
            }
            
            setTooltipStyle(tooltipPos);
        } else {
            // Element not found, center the tooltip
            customText = "This feature is available on another screen. Let's continue for now, you can restart the tutorial later from settings!";
            setHighlightStyle({ width: '0px', height: '0px', top: '50%', left: '50%', opacity: 0 });
            setTooltipStyle({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 1 });
        }
        
        setCurrentStepConfig({ ...step, text: customText });

    }, [tutorialStep, activeSessionId]);

    const isLastStep = tutorialStep === TUTORIAL_STEPS.length - 1;

    return (
        <div className="fixed inset-0 z-[100]" aria-live="polite" aria-label="Application Tutorial">
            <div
                className="absolute border-2 border-violet-500 rounded-lg shadow-2xl transition-all duration-300 ease-in-out pointer-events-none"
                style={{
                    ...highlightStyle,
                    borderColor: 'var(--color-accent)',
                    boxShadow: `0 0 0 9999px rgba(0,0,0,0.7), 0 0 20px var(--color-accent)`,
                }}
            />
            <div
                className="absolute w-80 bg-[#1F2937] rounded-lg p-5 shadow-lg transition-all duration-300 ease-in-out"
                style={{ ...tooltipStyle, backgroundColor: 'var(--color-panel-bg)' }}
                role="dialog"
                aria-labelledby="tutorial-title"
            >
                <h3 id="tutorial-title" className="text-xl font-bold mb-2" style={{color: 'var(--color-accent)'}}>{currentStepConfig.title}</h3>
                <p className="text-sm mb-4" style={{color: 'var(--color-text-primary)'}}>{currentStepConfig.text}</p>
                <div className="flex justify-between items-center">
                    <button onClick={endTutorial} className="text-sm text-gray-400 hover:text-white">Skip Tour</button>
                    <div className="flex items-center gap-2">
                        {tutorialStep > 0 && (
                            <button onClick={prevTutorialStep} className="px-3 py-1 text-sm rounded-md hover:bg-white/10">Back</button>
                        )}
                        <button
                            onClick={isLastStep ? endTutorial : nextTutorialStep}
                            className="px-4 py-2 text-sm font-semibold rounded-md"
                            style={{backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)'}}
                        >
                            {isLastStep ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>
                 <div className="flex justify-center mt-4" role="navigation" aria-label="Tutorial Progress">
                    {TUTORIAL_STEPS.map((_, index) => (
                        <div key={index} className={`w-2 h-2 rounded-full mx-1 ${index === tutorialStep ? 'bg-violet-500' : 'bg-gray-600'}`} style={{backgroundColor: index === tutorialStep ? 'var(--color-accent)' : 'var(--color-border)'}}/>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tutorial;