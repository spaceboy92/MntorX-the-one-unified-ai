import React, { useState } from 'react';
import { ChatMessage, ToolCall, Attachment } from '../types';
import { BrainIcon, TokenIcon, RegenerateIcon, PencilIcon, ExecuteIcon, FileIcon } from '../constants';
import { useMentorX } from '../hooks/useNexusAI';

const CodeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 01-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;

const ToolCallRequest: React.FC<{ toolCalls: ToolCall[] }> = ({ toolCalls }) => {
    return (
        <div className="mt-3 pt-3 border-t border-slate-700/50">
            <h4 className="text-xs font-bold text-violet-300 mb-2 uppercase tracking-wider">Requested Actions</h4>
            <div className="space-y-2">
                {toolCalls.map(call => (
                    <div key={call.id} className="bg-black/20 p-2 rounded-md">
                        <p className="text-sm font-semibold text-gray-200 flex items-center">
                            <CodeIcon />
                            <span className="ml-2">{call.function.name}</span>
                        </p>
                        <div className="pl-7 text-xs text-gray-400">
                            {Object.entries(call.function.arguments).map(([key, value]) => (
                                <p key={key} className="truncate">
                                    <span className="font-medium">{key}:</span> {typeof value === 'string' ? `"${value}"` : JSON.stringify(value)}
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AttachmentDisplay: React.FC<{ attachment: Attachment, onImageClick?: (url: string) => void }> = ({ attachment, onImageClick }) => {
    const dataUrl = `data:${attachment.type};base64,${attachment.data}`;
    const fileType = attachment.type.split('/')[0];

    switch (fileType) {
        case 'image':
            return (
                <img 
                    src={dataUrl} 
                    alt={attachment.name}
                    className="rounded-lg max-w-sm w-full max-h-80 object-contain border border-slate-600 cursor-pointer hover:opacity-80 transition-opacity my-2"
                    onClick={() => onImageClick?.(dataUrl)}
                />
            );
        case 'audio':
            return (
                 <div className="my-2 p-3 bg-black/20 rounded-lg">
                    <p className="text-sm font-semibold text-gray-300 mb-2">{attachment.name}</p>
                    <audio controls src={dataUrl} className="w-full" />
                </div>
            )
        case 'video':
             return (
                 <div className="my-2 p-3 bg-black/20 rounded-lg">
                    <p className="text-sm font-semibold text-gray-300 mb-2">{attachment.name}</p>
                    <video controls src={dataUrl} className="w-full rounded" />
                </div>
            )
        default:
            return (
                 <div className="my-2 p-3 bg-black/20 rounded-lg flex items-center gap-3">
                    <FileIcon />
                    <div>
                        <p className="text-sm font-semibold text-gray-300">{attachment.name}</p>
                        <p className="text-xs text-gray-400">{(attachment.size / 1024).toFixed(2)} KB</p>
                    </div>
                </div>
            );
    }
};


interface ChatMessageProps {
  message: ChatMessage;
  isLastAssistantMessage: boolean;
  style?: React.CSSProperties;
  onSuggestedActionClick?: (action: string) => void;
  onImageClick?: (imageUrl: string) => void;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = React.memo(({ message, isLastAssistantMessage, style, onSuggestedActionClick, onImageClick }) => {
  const { theme, editMessage, regenerateLastResponse, activeSession, isLoading } = useMentorX();
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.text);

  const isAssistant = message.role === 'assistant';
  const isToolResponse = message.role === 'tool';


  const handleCopy = () => {
    navigator.clipboard.writeText(message.text).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    });
  };
  
  const handleEditSubmit = () => {
    if (activeSession && editedText.trim() !== message.text) {
      editMessage(activeSession.id, message.id, editedText.trim());
    }
    setIsEditing(false);
  };

  const handleRegenerate = () => {
    if (activeSession) {
      regenerateLastResponse(activeSession.id);
    }
  };

  const UserAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center shrink-0 font-bold text-slate-300">
      U
    </div>
  );

  const AssistantAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center shrink-0 relative">
      <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 18V6l8 8 8-8v12"/>
      </svg>
      {message.isCached && (
          <span className="absolute -bottom-1 -right-2 text-violet-300 bg-slate-700 rounded-full p-0.5" title="Response from MentorX Core™ Cache">
              <BrainIcon />
          </span>
      )}
    </div>
  );
  
  const ToolAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 text-green-400" title="Tool Execution">
      <CheckCircleIcon />
    </div>
  );
  
  const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
  const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;

  const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
    </svg>
  );

  const formatText = (text: string) => {
    if (!text) return null;
    const codeBlockRegex = /```(\w+)?\n([\s\S]+?)\n```/g;
    const result: (JSX.Element | null)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const textPart = text.substring(lastIndex, match.index);
        const boldRegex = /\*\*(.*?)\*\*/g;
        const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
        const html = textPart
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(boldRegex, '<strong>$1</strong>')
            .replace(linkRegex, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-violet-400 hover:underline font-medium">$1</a>');
        result.push(<div key={lastIndex} className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: html }} />);
      }
      
      const language = match[1] || 'plaintext';
      result.push(<pre key={match.index}><code className={`language-${language}`}>{match[2]}</code></pre>);
      
      lastIndex = codeBlockRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      const boldRegex = /\*\*(.*?)\*\*/g;
      const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
      const html = remainingText
          .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
          .replace(boldRegex, '<strong>$1</strong>')
          .replace(linkRegex, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-violet-400 hover:underline font-medium">$1</a>');
      result.push(<div key={lastIndex} className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: html }} />);
    }

    return result;
  };

  if (isToolResponse) {
      return (
        <div style={style} className="flex items-start gap-4 py-4">
          <ToolAvatar />
           <div className="w-fit max-w-[calc(100%-4rem)] p-3 rounded-xl relative group text-gray-100 italic bg-slate-700/50 rounded-bl-none">
              <p className="text-sm text-gray-400">Tool execution completed.</p>
           </div>
        </div>
      );
  }

  return (
    <div style={style} className="flex items-start gap-4 py-4 group/message">
      {isAssistant ? <AssistantAvatar /> : <UserAvatar />}
      <div
        className={`w-fit max-w-[calc(100%-4rem)] rounded-xl relative text-gray-100 leading-relaxed ${
          isEditing ? 'p-0' : 'p-4'
        } ${
          isAssistant
            ? message.isCached ? 'bg-gradient-to-br from-[#252A37] to-[#1F2937] border border-violet-500/20 rounded-tl-none' : 'bg-[#1F2937] rounded-tl-none'
            : 'bg-[#373B53]/80 rounded-tr-none'
        }`}
      >
        <div className={`absolute top-0 right-0 -mt-4 flex items-center gap-1 transition-opacity opacity-0 group-hover/message:opacity-100 ${isEditing ? 'hidden' : ''}`}>
            {isAssistant && message.text && (
                 <button onClick={handleCopy} className="p-1.5 bg-slate-800/80 backdrop-blur-sm rounded-full text-slate-300 hover:text-white" aria-label="Copy message">
                    {isCopied ? <CheckIcon/> : <CopyIcon/>}
                </button>
            )}
            {!isAssistant && !isLoading && (
                <button onClick={() => setIsEditing(true)} className="p-1.5 bg-slate-800/80 backdrop-blur-sm rounded-full text-slate-300 hover:text-white" aria-label="Edit message">
                    <PencilIcon />
                </button>
            )}
        </div>
        
        {isEditing ? (
            <div className="w-[40rem] max-w-full">
                <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleEditSubmit(); } }}
                    autoFocus
                    className="w-full bg-transparent text-gray-200 p-4 resize-y focus:outline-none focus:ring-2 rounded-xl"
                    style={{'--tw-ring-color': theme.colors.accent} as React.CSSProperties}
                />
                <div className="p-2 flex justify-end gap-2">
                    <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-sm rounded-md hover:bg-white/10">Cancel</button>
                    <button onClick={handleEditSubmit} className="px-3 py-1 text-sm rounded-md" style={{backgroundColor: theme.colors.accent, color: theme.colors.accentText}}>Save & Submit</button>
                </div>
            </div>
        ) : (
            <div className="prose prose-invert prose-sm md:prose-base max-w-none">
              {message.attachment && <AttachmentDisplay attachment={message.attachment} onImageClick={onImageClick} />}
              
              {formatText(message.text)}
              
              {isLoading && isLastAssistantMessage && <span className="blinking-cursor" />}
            </div>
        )}
        
        {message.toolCalls && message.toolCalls.length > 0 && <ToolCallRequest toolCalls={message.toolCalls} />}

        {message.sources && message.sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-700/50">
                <h4 className="text-xs font-semibold text-gray-400 mb-2">Sources</h4>
                <ul className="space-y-2">
                    {message.sources.map((source, index) => (
                        <li key={index}>
                            <a 
                                href={source.uri} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-start text-sm text-violet-400 hover:text-violet-300 hover:underline"
                            >
                                <LinkIcon />
                                <span className="truncate">{source.title}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        )}
        {message.suggestedActions && message.suggestedActions.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-700/50">
                <h4 className="text-xs font-semibold text-gray-400 mb-2">Suggested Actions</h4>
                <div className="flex flex-col items-start gap-2">
                    {message.suggestedActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => onSuggestedActionClick?.(action)}
                            className="w-full text-left flex items-center gap-3 p-2 rounded-md bg-black/20 hover:bg-black/40 transition-colors"
                        >
                            <span className="text-violet-400"><ExecuteIcon /></span>
                            <span className="text-sm font-medium text-gray-200">{action}</span>
                        </button>
                    ))}
                </div>
            </div>
        )}
        {isLastAssistantMessage && !isLoading && message.text && (
             <div className="mt-2 text-center">
                <button onClick={handleRegenerate} className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-md text-gray-400 hover:bg-white/10 hover:text-white">
                    <RegenerateIcon /> Regenerate
                </button>
            </div>
        )}
        {message.tokens !== undefined && !isEditing && (
            <div className="text-right text-xs text-gray-500 mt-2 flex items-center justify-end font-mono">
                <span className="text-violet-500 mr-1"><TokenIcon /></span>
                {message.tokens} tokens
            </div>
        )}
      </div>
    </div>
  );
});

export default ChatMessageComponent;