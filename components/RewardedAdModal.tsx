import React, { useState, useEffect } from 'react';

const VideoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm14.553 1.106l-4.19 2.445A1 1 0 0111.5 10.447V14a1 1 0 01-1.553.832l-5-3A1 1 0 015 11V7a1 1 0 011.553-.832l5-3a1 1 0 011.447.894v2.553z" />
    </svg>
);


interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
}

const RewardedAdModal: React.FC<Props> = ({ isOpen, onClose, onConfirm, title, description, confirmText = "Watch Ad" }) => {
    const [isWatchingAd, setIsWatchingAd] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!isWatchingAd) return;

        const timer = setInterval(() => {
            setProgress(prev => {
                const next = prev + 20;
                if (next >= 100) {
                    clearInterval(timer);
                    setTimeout(() => {
                        onConfirm();
                        setIsWatchingAd(false);
                        setProgress(0);
                    }, 500);
                    return 100;
                }
                return next;
            });
        }, 1000); // 5 seconds total

        return () => clearInterval(timer);
    }, [isWatchingAd, onConfirm]);

    useEffect(() => {
        if (isOpen) {
            setIsWatchingAd(false);
            setProgress(0);
        }
    }, [isOpen]);


    if (!isOpen) return null;

    return (
        <div 
          className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4"
          onClick={!isWatchingAd ? onClose : undefined}
        >
          <div 
            className="bg-[#1F2937] border border-slate-700/50 rounded-xl shadow-2xl w-full max-w-md p-8 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            {!isWatchingAd ? (
                <>
                    <h3 className="text-2xl font-bold text-yellow-300 mb-2">{title}</h3>
                    <p className="text-gray-300 mb-6">{description}</p>
                    <div className="flex justify-center gap-4">
                        <button onClick={onClose} className="px-6 py-2 rounded-lg bg-slate-600/50 text-white font-semibold hover:bg-slate-500/50">
                            Cancel
                        </button>
                        <button onClick={() => setIsWatchingAd(true)} className="px-6 py-2 rounded-lg bg-yellow-500 text-slate-900 font-semibold hover:bg-yellow-600 flex items-center">
                            <VideoIcon /> {confirmText}
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <h3 className="text-2xl font-bold text-white mb-4">Your reward is loading...</h3>
                    <p className="text-gray-400 mb-6">Thank you for supporting MentorX!</p>
                    <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                        <div 
                            className="bg-yellow-500 h-4 rounded-full transition-all duration-1000 ease-linear"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </>
            )}
            
          </div>
        </div>
    );
};

export default RewardedAdModal;