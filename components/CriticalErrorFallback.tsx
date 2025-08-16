import React, { useState, useEffect } from 'react';

const WarningIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.22 3.001-1.742 3.001H4.42c-1.522 0-2.492-1.667-1.742-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>

interface Props {
    error: Error | null;
    onRecover: () => void;
}

const CriticalErrorFallback: React.FC<Props> = ({ error, onRecover }) => {
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        const recoveryTimeout = setTimeout(() => {
            onRecover();
        }, 3000);

        return () => {
            clearInterval(timer);
            clearTimeout(recoveryTimeout);
        };
    }, [onRecover]);

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#111827] text-gray-200 p-8">
            <div className="text-center">
                <div className="inline-block bg-red-500/20 p-4 rounded-full mb-6 text-red-400">
                    <WarningIcon />
                </div>
                <h1 className="text-3xl font-bold text-red-400 mb-2">Critical System Error Detected</h1>
                <p className="text-lg text-gray-400 mb-6 max-w-xl">MentorX has encountered an anomaly and will perform an automatic self-repair.</p>
                
                {error && (
                    <div className="my-4 p-4 bg-slate-900/50 rounded-lg text-left max-w-2xl mx-auto border border-slate-700">
                        <p className="font-semibold text-gray-300">Error Details:</p>
                        <pre className="text-sm text-red-300/80 whitespace-pre-wrap mt-2 font-mono overflow-auto max-h-40">
                            {error.message}
                        </pre>
                    </div>
                )}
                
                <div className="mt-8 flex items-center justify-center p-3 px-6 rounded-lg bg-slate-800 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 animate-spin" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Rebooting in {countdown > 0 ? countdown : 0}...
                </div>
            </div>
        </div>
    );
};

export default CriticalErrorFallback;