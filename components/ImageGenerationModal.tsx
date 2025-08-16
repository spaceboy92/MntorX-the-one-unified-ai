import React, { useState } from 'react';
import { useMentorX } from '../hooks/useNexusAI';
import { ProIcon } from '../constants';
import RewardedAdModal from './RewardedAdModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string, aspectRatio: string, numberOfImages: number) => void;
}

const AdIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-900" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm14.553 1.106l-4.19 2.445A1 1 0 0111.5 10.447V14a1 1 0 01-1.553.832l-5-3A1 1 0 015 11V7a1 1 0 011.553-.832l5-3a1 1 0 011.447.894v2.553z" />
    </svg>
);

const ImageGenerationModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const { isPremiumUser, isLoading } = useMentorX();
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [isAdModalVisible, setIsAdModalVisible] = useState(false);
  
  const aspectRatios = [
      { value: '1:1', label: 'Square', isPro: false },
      { value: '16:9', label: 'Widescreen', isPro: true },
      { value: '9:16', label: 'Portrait', isPro: true },
      { value: '4:3', label: 'Landscape', isPro: true },
      { value: '3:4', label: 'Tall', isPro: true },
  ];

  const stylePresets = [
    "Photorealistic", "Cinematic", "Anime", "Fantasy Art", "Sci-Fi", "Cyberpunk", "Watercolor", "Low Poly", "Isometric", "Pixel Art"
  ];

  const imageCountOptions = [1, 2, 4];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    if (numberOfImages === 4 && !isPremiumUser) {
        setIsAdModalVisible(true);
        return;
    }

    let finalPrompt = prompt;
    if (negativePrompt.trim()) {
        finalPrompt += `, negative prompt: ${negativePrompt.trim()}`;
    }
    onSubmit(finalPrompt, aspectRatio, numberOfImages);
  };

  const handleGenerateAfterAd = () => {
      setIsAdModalVisible(false);
      if (!prompt.trim()) return;
      let finalPrompt = prompt;
      if (negativePrompt.trim()) {
        finalPrompt += `, negative prompt: ${negativePrompt.trim()}`;
      }
      onSubmit(finalPrompt, aspectRatio, numberOfImages);
  }

  const applyStyle = (style: string) => {
    setPrompt(p => p ? `${p}, ${style.toLowerCase()}` : style);
  }

  return (
    <>
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#1F2937] border border-slate-700/50 rounded-xl shadow-2xl w-full max-w-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h2 className="text-2xl font-bold text-white mb-2">Create an Image</h2>
            <p className="text-gray-400 mb-6">Describe the image you want to generate with AI.</p>
        </div>
        
        <form onSubmit={handleSubmit}>
            <div className="px-6 sm:px-8 max-h-[60vh] overflow-y-auto">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">Prompt</label>
                        <textarea
                            id="prompt"
                            rows={3}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="A photorealistic red panda in an astronaut helmet..."
                            className="w-full bg-[#111827] border border-slate-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="negative-prompt" className="block text-sm font-medium text-gray-300 mb-2">Negative Prompt <span className="text-gray-500">(Optional)</span></label>
                        <input
                            type="text"
                            id="negative-prompt"
                            value={negativePrompt}
                            onChange={(e) => setNegativePrompt(e.target.value)}
                            placeholder="Things to avoid in the image, e.g. text, watermarks, blurry"
                            className="w-full bg-[#111827] border border-slate-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Style Presets</label>
                        <div className="flex flex-wrap gap-2">
                            {stylePresets.map(style => (
                                <button key={style} type="button" onClick={() => applyStyle(style)} className="px-3 py-1 bg-slate-700/80 text-slate-200 text-sm rounded-full hover:bg-slate-600 transition-colors">
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">Number of Images</label>
                            <div className="flex gap-3">
                                {imageCountOptions.map(count => {
                                    const isProFeature = count > 1;
                                    const isRewarded = count === 4;
                                    const isLocked = isProFeature && !isPremiumUser && !isRewarded;
                                    const requiresAd = isRewarded && !isPremiumUser;

                                    return (
                                        <div key={count} className="relative w-full">
                                            <button
                                                type="button"
                                                onClick={() => !isLocked && setNumberOfImages(count)}
                                                disabled={isLocked}
                                                className={`w-full p-3 rounded-lg border-2 transition-colors text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1F2937] focus:ring-violet-500 disabled:cursor-not-allowed disabled:opacity-50
                                                ${numberOfImages === count ? 'bg-violet-500/20 border-violet-500 text-white' : 'bg-slate-700/50 border-transparent text-gray-300 hover:border-slate-500'}`}
                                            >
                                                {count}
                                            </button>
                                            {isLocked && <div className="absolute -top-2 -right-2" title="This is a Premium feature"><ProIcon /></div>}
                                            {requiresAd && (
                                                <div className="absolute -top-2 -right-2 p-1 bg-yellow-400 rounded-full shadow" title="Unlock with Ad">
                                                    <AdIcon />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">Aspect Ratio</label>
                        <div className="grid grid-cols-5 gap-2">
                            {aspectRatios.map(ar => {
                            const isLocked = ar.isPro && !isPremiumUser;
                            return (
                                <div key={ar.value} className="relative">
                                <button
                                    type="button"
                                    onClick={() => !isLocked && setAspectRatio(ar.value)}
                                    disabled={isLocked}
                                    className={`w-full p-3 rounded-lg border-2 transition-colors text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1F2937] focus:ring-violet-500 disabled:cursor-not-allowed disabled:opacity-50
                                    ${aspectRatio === ar.value ? 'bg-violet-500/20 border-violet-500 text-white' : 'bg-slate-700/50 border-transparent text-gray-300 hover:border-slate-500'}`}
                                >
                                    {ar.label}
                                </button>
                                {isLocked && 
                                    <div className="absolute -top-2 -right-2" title="This aspect ratio is a Premium feature">
                                    <ProIcon />
                                    </div>
                                }
                                </div>
                            );
                            })}
                        </div>
                        </div>
                    </div>
                </div>
            </div>
          
            <div className="mt-4 p-6 sm:p-8 bg-black/20 border-t border-slate-700/50 flex justify-end">
                <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="px-6 py-3 rounded-lg bg-violet-500 text-white font-semibold hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-wait flex items-center"
                >
                {isLoading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                {isLoading ? 'Generating...' : `Generate ${numberOfImages} Image${numberOfImages > 1 ? 's' : ''}`}
                </button>
            </div>
        </form>
      </div>
    </div>
    <RewardedAdModal 
        isOpen={isAdModalVisible}
        onClose={() => setIsAdModalVisible(false)}
        onConfirm={handleGenerateAfterAd}
        title="Unlock a Premium Feature!"
        description="Generate 4 images at once by watching a short ad. This helps support MentorX."
        confirmText="Watch Ad & Generate"
    />
    </>
  );
};

export default ImageGenerationModal;