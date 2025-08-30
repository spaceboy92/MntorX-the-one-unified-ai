import React, { useState, useRef, useEffect } from 'react';
import { useMentorX } from '../hooks/useNexusAI';
import ChatMessageComponent from './ChatMessage';
import { PerformanceIcon, TrashIcon, DeepAnalysisIcon, ImageIcon, PersonaIcon, MicrophoneIcon, FocusIcon, FileIcon } from '../constants';
import ImageGenerationModal from './ImageGenerationModal';
import ImagePreviewModal from './ImagePreviewModal';
import RewardedAdModal from './RewardedAdModal';
import { Attachment } from '../types';

const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>;
const MoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const PaperclipIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>;
const StopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const BoostIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>;

const getQuickActions = (fileType: string): string[] => {
    if (fileType.startsWith('image/')) {
        return ["Describe this image in detail.", "What objects are in this picture?", "Write a caption for this photo."];
    }
    if (fileType.startsWith('audio/')) {
        return ["Transcribe the speech from this audio.", "Summarize this audio file.", "What is the mood of this recording?"];
    }
    if (fileType.startsWith('video/')) {
        return ["Describe what happens in this video.", "Create a short summary of this video.", "List the key scenes or events."];
    }
    if (fileType.startsWith('text/')) {
        return ["Summarize this document.", "Extract the key points as a bulleted list.", "What is the main idea of this text?"];
    }
     if (fileType.includes('javascript') || fileType.includes('typescript')) {
        return ["Explain what this code does.", "Refactor this code for readability.", "Find potential bugs in this code."];
    }
    if (fileType.includes('python')) {
        return ["Explain this Python script.", "Suggest improvements for this code.", "Add docstrings to this code."];
    }
    return [];
};

const UnifiedChat: React.FC = () => {
    const { 
        activeSession, 
        isLoading, 
        sendMessage,
        stopGeneration,
        deleteChat, 
        exportChat,
        toggleSessionWebAccess,
        toggleSessionDeepAnalysis,
        isLowFidelityMode, 
        toggleLowFidelityMode,
        isCostSaverMode,
        toggleCostSaverMode,
        isPremiumUser,
        setIsSidebarOpen,
        theme,
        setSessionPersona,
        activePersona,
        isRecording,
        startRecording,
        stopRecording,
        isFocusMode,
        setIsFocusMode,
    } = useMentorX();
    const [prompt, setPrompt] = useState('');
    const [attachment, setAttachment] = useState<Attachment | null>(null);
    const [attachmentPreviewUrl, setAttachmentPreviewUrl] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [previewedImage, setPreviewedImage] = useState<string | null>(null);
    const [isBoostAdOpen, setIsBoostAdOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    if (!activeSession || !activePersona) return null;

    const messages = activeSession.messages;
    
    const clearInput = () => {
        setPrompt('');
        setAttachment(null);
        setAttachmentPreviewUrl(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
    }
    
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if(file.size > 20 * 1024 * 1024) { // 20MB limit for all files
                alert("File size cannot exceed 20MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result as string;
                const base64String = dataUrl.split(',')[1];
                setAttachmentPreviewUrl(dataUrl);
                setAttachment({ 
                    name: file.name,
                    type: file.type,
                    data: base64String,
                    size: file.size,
                });
            };
            reader.readAsDataURL(file);
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if ((!prompt.trim() && !attachment) || isLoading) return;
        sendMessage(prompt, attachment);
        clearInput();
    };
    
    const handleBoostClick = () => {
        if ((!prompt.trim() && !attachment) || isLoading) return;
        setIsBoostAdOpen(true);
    };

    const handleBoostedSubmit = () => {
        setIsBoostAdOpen(false);
        if ((!prompt.trim() && !attachment) || isLoading) return;
        sendMessage(prompt, attachment, undefined, true);
        clearInput();
    };

    const handleImageSubmitFromModal = (imagePrompt: string, aspectRatio: string, numberOfImages: number) => {
        if (!imagePrompt.trim() || isLoading) return;
        sendMessage(imagePrompt, null, { aspectRatio, numberOfImages });
        setIsImageModalOpen(false);
    };
    
    const handleImagePreview = (imageUrl: string) => {
        setPreviewedImage(imageUrl);
    };

    const handleEditFromPreview = (imageUrl: string) => {
        const [header, data] = imageUrl.split(',');
        if (!data) {
            alert("Sorry, only generated or uploaded images can be used for editing.");
            return;
        }
        const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
        setAttachmentPreviewUrl(imageUrl);
        setAttachment({ name: 'editing-image.jpg', type: mimeType, data: data, size: data.length });
        textareaRef.current?.focus();
    };

    const handleMicClick = async () => {
        if (isRecording) {
            const transcript = await stopRecording();
            if (transcript) {
                setPrompt(p => p + transcript);
            }
        } else {
            startRecording();
        }
    };
    
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);
    
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 192)}px`;
        }
    }, [prompt]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDeleteChat = () => {
        if (window.confirm('Are you sure you want to delete this conversation? This cannot be undone.')) {
            deleteChat(activeSession.id);
        }
        setIsMenuOpen(false);
    };

    const handleExportChat = () => {
        exportChat(activeSession.id);
        setIsMenuOpen(false);
    };
    
    const quickActions = attachment ? getQuickActions(attachment.type) : [];

    const AttachmentPreview = () => {
        if (!attachment || !attachmentPreviewUrl) return null;
        
        const fileType = attachment.type.split('/')[0];

        return (
             <div className="p-2 relative w-fit bg-black/20 rounded-md">
                <div className="flex items-center gap-3">
                    {fileType === 'image' ? (
                        <img src={attachmentPreviewUrl} alt="Preview" className="h-20 w-20 object-cover rounded" />
                    ) : (
                        <div className="h-20 w-20 flex flex-col items-center justify-center bg-slate-700 rounded text-slate-400 p-2">
                            <FileIcon />
                            <span className="text-xs mt-1 text-center break-all line-clamp-2">{attachment.name}</span>
                        </div>
                    )}
                </div>
                <button onClick={clearInput} className="absolute -top-1 -right-1 bg-slate-800 rounded-full text-white p-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        );
    }
    
    return (
        <div className="flex-1 flex flex-col h-full min-w-0" style={{backgroundColor: 'var(--color-app-bg)'}}>
            <header className="p-4 border-b bg-black/10 backdrop-blur-sm flex justify-between items-center z-10" style={{ borderColor: theme.colors.border }}>
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-1 rounded-full text-gray-400 hover:text-white lg:hidden" aria-label="Open sidebar">
                        <MenuIcon />
                    </button>
                    <div className="w-10 h-10 border rounded-lg flex items-center justify-center shrink-0" style={{ borderColor: theme.colors.border, color: theme.colors.accent, backgroundColor: `${theme.colors.accent}1A` }}>
                        {activePersona.icon}
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold tracking-wide" style={{ color: theme.colors.textPrimary }}>{activePersona.name}</h2>
                </div>
                <div data-tutorial-id="chat-header-toggles" className="flex items-center space-x-1 sm:space-x-2 flex-wrap justify-end">
                <div className="w-px h-6 bg-slate-700 hidden sm:block"></div>
                {/* Deep Analysis Toggle */}
                <div className="flex items-center gap-2 relative group" title="Deep Analysis provides more detailed, expert-level responses.">
                    <span className={`text-sm font-medium transition-colors ${activeSession.isDeepAnalysis ? 'text-violet-400' : 'text-gray-500'}`}><DeepAnalysisIcon/></span>
                    <button
                        onClick={() => toggleSessionDeepAnalysis(activeSession.id)}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed ${
                            activeSession.isDeepAnalysis ? 'bg-violet-500' : 'bg-slate-600'
                        }`}
                        style={{
                            backgroundColor: activeSession.isDeepAnalysis ? theme.colors.accent : '#475569',
                            '--tw-ring-color': theme.colors.accent,
                            '--tw-ring-offset-color': theme.colors.appBg
                        } as React.CSSProperties}
                        aria-label="Toggle Deep Analysis Mode"
                    >
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${ activeSession.isDeepAnalysis ? 'translate-x-6' : 'translate-x-1' }`} />
                    </button>
                </div>
                <div className="w-px h-6 bg-slate-700 hidden sm:block"></div>
                {/* Web Access Toggle */}
                <span className={`text-sm font-medium transition-colors ${activeSession.isWebAccessEnabled ? 'text-violet-400' : 'text-gray-500'}`}>Live Web</span>
                <button
                    onClick={() => toggleSessionWebAccess(activeSession.id)}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        activeSession.isWebAccessEnabled ? 'bg-violet-500' : 'bg-slate-600'
                    }`}
                    style={{
                            backgroundColor: activeSession.isWebAccessEnabled ? theme.colors.accent : '#475569',
                            '--tw-ring-color': theme.colors.accent,
                            '--tw-ring-offset-color': theme.colors.appBg
                        } as React.CSSProperties}
                    aria-label="Toggle Live Web Access"
                >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${ activeSession.isWebAccessEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <div className="flex items-center">
                    <button onClick={() => setIsFocusMode(f => !f)} className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors" aria-label={isFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"} title={isFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"}>
                        <FocusIcon />
                    </button>
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                            aria-label="More options"
                        >
                            <MoreIcon />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-56 border rounded-lg shadow-xl z-20" style={{backgroundColor: theme.colors.panelBg, borderColor: theme.colors.border}}>
                                <div className="py-1">
                                    <button onClick={handleDeleteChat} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-red-600/50 hover:text-red-300">
                                        <TrashIcon />
                                        <span className="ml-3">Delete Conversation</span>
                                    </button>
                                    <button onClick={handleExportChat} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10">
                                        <DownloadIcon />
                                        <span className="ml-3">Export Chat</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                </div>
            </header>
            
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-2 sm:p-6">
                <div className="flex flex-col">
                    {messages.map((msg, index) => (
                        <ChatMessageComponent 
                            key={msg.id} 
                            message={msg} 
                            isLastAssistantMessage={msg.role === 'assistant' && index === messages.length -1 && !isLoading}
                            onImageClick={handleImagePreview}
                        />
                    ))}
                </div>
            </div>

            <div data-tutorial-id="prompt-bar" className="p-2 md:p-6 border-t" style={{borderColor: theme.colors.border}}>
                <div className="rounded-lg p-2" style={{backgroundColor: theme.colors.panelBg}}>
                    <div className="flex flex-wrap items-start gap-2">
                         <AttachmentPreview />
                         {quickActions.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 p-2 max-w-md">
                                {quickActions.map(action => (
                                    <button 
                                        key={action}
                                        onClick={() => { setPrompt(action); textareaRef.current?.focus(); }}
                                        className="px-3 py-1 bg-slate-700 text-slate-200 text-xs rounded-full hover:bg-slate-600 transition-colors"
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>
                         )}
                    </div>
                    <form onSubmit={handleSubmit} className="relative flex items-end">
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                    
                    <button type="button" title="Attach file" onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="p-3 text-gray-400 hover:text-violet-400 disabled:opacity-50">
                        <PaperclipIcon />
                    </button>

                    <button type="button" title="Generate an Image" onClick={() => setIsImageModalOpen(true)} disabled={isLoading} className="p-3 text-gray-400 hover:text-violet-400 disabled:opacity-50">
                        <ImageIcon />
                    </button>
                     <button type="button" title="Use Voice" onClick={handleMicClick} disabled={isLoading} className={`p-3 hover:text-violet-400 disabled:opacity-50 ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
                        <MicrophoneIcon />
                    </button>
                    <textarea
                        ref={textareaRef}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
                        placeholder={isLoading ? "Waiting for response..." : isRecording ? "Listening..." : (activePersona.placeholder || 'Ask me anything, or attach a file...')}
                        rows={1}
                        maxLength={2000}
                        className="w-full bg-transparent text-gray-200 placeholder-gray-500 py-3 pl-2 pr-24 resize-none focus:outline-none focus:ring-0 transition-all max-h-48"
                        disabled={isLoading}
                    />
                    <div className="absolute right-3 bottom-3 flex items-center gap-2">
                        {!isPremiumUser && (
                            <button type="button" onClick={handleBoostClick} disabled={isLoading || (!prompt.trim() && !attachment)} className="p-2 rounded-full bg-yellow-400 text-slate-900 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed" title="Boost for a higher-quality response (watch ad)">
                                <BoostIcon />
                            </button>
                        )}
                        {isLoading ? (
                            <button type="button" onClick={stopGeneration} className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors" aria-label="Stop generation">
                            <StopIcon />
                            </button>
                        ) : (
                            <button type="submit" disabled={!prompt.trim() && !attachment} className="p-2 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all" aria-label="Send message" style={{ backgroundColor: theme.colors.accent }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                            </button>
                        )}
                    </div>
                    </form>
                </div>
            </div>
            <ImageGenerationModal 
                isOpen={isImageModalOpen} 
                onClose={() => setIsImageModalOpen(false)}
                onSubmit={handleImageSubmitFromModal}
            />
             <ImagePreviewModal 
                isOpen={!!previewedImage}
                onClose={() => setPreviewedImage(null)}
                imageUrl={previewedImage}
                onEdit={handleEditFromPreview}
            />
            <RewardedAdModal
                isOpen={isBoostAdOpen}
                onClose={() => setIsBoostAdOpen(false)}
                onConfirm={handleBoostedSubmit}
                title="Get a Premium Response!"
                description="Watch a short ad to get a higher-quality, 'Deep Analysis' response for this single message."
                confirmText="Watch Ad & Boost"
            />
        </div>
    )
}

export default UnifiedChat;