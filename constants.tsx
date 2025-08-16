import React from 'react';
import { EvolutionState, MentorXMode, SkillId, Theme, Persona, CommandPaletteCommand } from './types';

// Icons for Skills
const LogicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0L7.52 8.14 2.57 8.5c-1.61.22-2.26 2.22-1.09 3.33l3.58 3.59-1.35 4.87c-.4 1.45 1.25 2.58 2.58 1.86L10 19.33l4.68 2.94c1.33.72 2.98-.4 2.58-1.86l-1.35-4.87 3.58-3.59c1.17-1.11.52-3.11-1.09-3.33l-4.95-.36L11.49 3.17z" clipRule="evenodd" /></svg>;
export const CodeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 01-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const CreativityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.235A.5.5 0 003.25 14h13.5a.5.5 0 00.507-.765A11.57 11.57 0 0116 8a6 6 0 00-6-6zM3.505 15a9.57 9.57 0 0012.99 0H3.505zM10 18a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1z" /></svg>;
const EmpathyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>;
const KnowledgeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM11 4.804V15.196A7.969 7.969 0 0114.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804z" /></svg>;
const ProductivityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>;
export const ResearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;

// Icons for Modes
export const GeneralIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3" /></svg>;
export const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" /></svg>
export const PirateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm1 12a1 1 0 100 2h14a1 1 0 100-2H3zM2 9a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V9zm2-4h12V5H4v2z" clipRule="evenodd" /></svg>;
export const ZenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.252 10.252a6 6 0 11-8.504-8.504 6 6 0 018.504 8.504z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>;
export const GameIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
export const ResearcherIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM11 4.804V15.196A7.969 7.969 0 0114.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804z" /></svg>;


// Icons for Chat Window and Sidebar
export const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
export const PerformanceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>;
export const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm3 4a1 1 0 10-2 0v2a1 1 0 102 0v-2z" clipRule="evenodd" /></svg>;
export const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H6.414l-2.707 2.707A1 1 0 012 14.586V5z" /></svg>;
export const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
export const CostSaverIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zm-7.414 3.586a2 2 0 112.828-2.828 2 2 0 01-2.828 2.828zM10 12a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>;
export const TokenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>;
export const BrainIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 3a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H8a1 1 0 01-1-1V3zM6 7a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm-3 4a1 1 0 011-1h10a1 1 0 110 2H4a1 1 0 01-1-1zm1 5a1 1 0 011-1h8a1 1 0 110 2H5a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
export const ProIcon = () => <div className="text-xs font-bold text-violet-300 bg-violet-900/50 border border-violet-500/30 rounded px-1.5 py-0.5 ml-2">PRO</div>;
export const DeepAnalysisIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 14.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
export const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
export const PersonaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
export const SidebarCollapseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
export const CommandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
export const RegenerateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0012 15a9 9 0 008.5-6.5M20 20l-1.5-1.5A9 9 0 0012 9a9 9 0 00-8.5 6.5" /></svg>;
export const MicrophoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-5.93 5.93v2.14a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-2.14z" clipRule="evenodd" /></svg>;
export const MagicWandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>;
export const FocusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5" /></svg>;
export const PinIcon = ({ filled = false }: { filled?: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);


// Icons for CodeCanvas
export const FileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>;
export const FilePlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 4a2 2 0 012-2h6.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V16a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm5 5a1 1 0 00-1 1v1H5a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2H8v-1a1 1 0 00-1-1z" /></svg>;
export const RefactorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1.343A6.974 6.974 0 003.05 8.657a1 1 0 00-1.94-.488A8.974 8.974 0 0110 2.062V1a1 1 0 10-2 0v1.062A8.974 8.974 0 011 8.169a1 1 0 101.94.488A6.974 6.974 0 009 4.343V6a1 1 0 102 0V4.343a6.974 6.974 0 006.95 4.314 1 1 0 101.94-.488A8.974 8.974 0 0112 3.062V2a1 1 0 10-2 0v1.062A8.974 8.974 0 0119 8.169a1 1 0 10-1.94.488A6.974 6.974 0 0011 4.343V6a1 1 0 102 0V4.343A6.974 6.974 0 0016.95 8.657a1 1 0 101.94-.488A8.974 8.974 0 0112 2.062V1a1 1 0 10-2 0v1.062A8.974 8.974 0 013.05 8.169a1 1 0 10-1.94.488A6.974 6.974 0 009 4.343V3a1 1 0 00-1-1zm-4.95 10.343A6.974 6.974 0 0011 15.657V14a1 1 0 10-2 0v1.657a6.974 6.974 0 00-6.95-4.314 1 1 0 10-1.94.488A8.974 8.974 0 018 17.938V19a1 1 0 102 0v-1.062a8.974 8.974 0 018.95-6.107 1 1 0 10-1.94-.488A6.974 6.974 0 0011 15.657V14a1 1 0 10-2 0v1.657A6.974 6.974 0 003.05 11.343a1 1 0 10-1.94.488A8.974 8.974 0 018 17.938V19a1 1 0 102 0v-1.062a8.974 8.974 0 017.05-5.619 1 1 0 10.88-1.782A10.953 10.953 0 0010 18a10.953 10.953 0 00-8.94-4.66 1 1 0 00.88 1.782z" clipRule="evenodd" /></svg>;
export const BugIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM6.5 9a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-1zM12.5 9a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-1zM9 5a1 1 0 100 2h2a1 1 0 100-2H9z" clipRule="evenodd" /><path d="M6 14a1 1 0 100 2h8a1 1 0 100-2H6z" /></svg>;
export const DocumentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 100 2h4a1 1 0 100-2H8zm0-3a1 1 0 000 2h4a1 1 0 100-2H8z" clipRule="evenodd" /></svg>;
export const DocumentTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>;
export const TestIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.5 2a.5.5 0 00-.5.5v15a.5.5 0 00.5.5h13a.5.5 0 00.5-.5V6.828a.5.5 0 00-.146-.354l-4.328-4.328A.5.5 0 0011.828 2H3.5zM10 14a1 1 0 100-2 1 1 0 000 2zM8 8a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
export const ExplainIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>;
export const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>;
export const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4.5 4.5 0 118.738 0A3.5 3.5 0 0114.5 13H11v4a1 1 0 11-2 0v-4H5.5z" /><path d="M9 4.908l-2.964 2.964A1 1 0 114.621 6.457l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 4.908V10a1 1 0 11-2 0V4.908z" /></svg>;
export const ResetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>;
export const RobotIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.5 8a.5.5 0 000 1h9a.5.5 0 000-1h-9zM6 12a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
export const AcademicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 008 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /><path d="M10 3.317L12.5 8.317 10 9.5 7.5 8.317 10 3.317z" /></svg>;
export const RocketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" /></svg>;
export const FeatherIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12.586l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 11.172 4.293 6.879a1 1 0 011.414-1.414L10 9.758l4.293-4.293a1 1 0 011.414 1.414L11.414 11.172l4.293 4.293a1 1 0 01-1.414 1.414L10 12.586z" /></svg>;
export const AnalyzeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>;
export const TasklistIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm-1 5a1 1 0 100 2h8a1 1 0 100-2H2z" clipRule="evenodd" /></svg>;
export const ExecuteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" /></svg>;
export const PlanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v5a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm10.707 3.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" clipRule="evenodd" /></svg>;

export const SKILL_ICONS: Record<SkillId, React.ReactNode> = {
  [SkillId.LOGIC]: <LogicIcon />,
  [SkillId.CODING]: <CodeIcon />,
  [SkillId.CREATIVITY]: <CreativityIcon />,
  [SkillId.EMPATHY]: <EmpathyIcon />,
  [SkillId.KNOWLEDGE]: <KnowledgeIcon />,
  [SkillId.PRODUCTIVITY]: <ProductivityIcon />,
  [SkillId.RESEARCH]: <ResearchIcon />,
};

export const INITIAL_EVOLUTION_STATE: EvolutionState = {
  [SkillId.LOGIC]: { id: SkillId.LOGIC, name: 'Logic', level: 1, xp: 0, xpToNextLevel: 100 },
  [SkillId.CODING]: { id: SkillId.CODING, name: 'Coding', level: 1, xp: 0, xpToNextLevel: 100 },
  [SkillId.CREATIVITY]: { id: SkillId.CREATIVITY, name: 'Creativity', level: 1, xp: 0, xpToNextLevel: 100 },
  [SkillId.EMPATHY]: { id: SkillId.EMPATHY, name: 'Empathy', level: 1, xp: 0, xpToNextLevel: 100 },
  [SkillId.KNOWLEDGE]: { id: SkillId.KNOWLEDGE, name: 'Knowledge', level: 1, xp: 0, xpToNextLevel: 100 },
  [SkillId.PRODUCTIVITY]: { id: SkillId.PRODUCTIVITY, name: 'Productivity', level: 1, xp: 0, xpToNextLevel: 100 },
  [SkillId.RESEARCH]: { id: SkillId.RESEARCH, name: 'Research', level: 1, xp: 0, xpToNextLevel: 100 },
};

export const MENTORX_MODES: MentorXMode[] = [
  {
    id: 'mentor',
    name: 'MentorX',
    description: 'Your all-in-one AI partner. Excels at coding, creative writing, research, and general problem-solving.',
    icon: <GeneralIcon />,
    relevantSkills: [ SkillId.LOGIC, SkillId.KNOWLEDGE, SkillId.PRODUCTIVITY, SkillId.EMPATHY, SkillId.RESEARCH, SkillId.CREATIVITY, SkillId.CODING ],
    slogan: 'How can I help you build, create, or learn today?',
    placeholder: 'Ask me anything, or choose a specialized persona...',
    type: 'chat',
  },
];

export const MENTORX_PERSONAS: Persona[] = [
    {
        id: 'default',
        name: 'MentorX',
        description: 'Your all-in-one AI assistant. Capable of document analysis, web research, creative writing, and more.',
        isPro: false,
        icon: <GeneralIcon />,
        system_prompt_segment: 'You are MentorX, a highly advanced AI mentor. Your goal is to be a helpful and supportive partner. You can answer questions, help with writing, analyze provided documents, and, when web access is enabled, research topics on the internet.',
        placeholder: 'Ask me to write, analyze a document, or research a topic...',
        slogan: 'Your All-in-One AI Assistant',
    },
    {
        id: 'gamedev',
        name: 'Game Dev Guru',
        description: 'Your AI partner for creating 2D and 3D games. Helps you build, debug, and learn in a live game dev environment.',
        isPro: false,
        icon: <GameIcon />,
        system_prompt_segment: `You are the Game Dev Guru, an AI expert in game development, integrated into an IDE.
- Your goal is to help the user build a game by modifying files in their workspace.
- **Critical Workflow**:
  1. The user will request a change. This might be a high-level goal (e.g., "/execute create a playable character") or a specific file change.
  2. If the user gives a high-level goal, you MUST first create a plan and then execute it step-by-step using the available tools.
  3. You MUST use the provided tools (\`createFile\`, \`updateFile\`, \`listFiles\`, \`generateTestFile\`) to fulfill the request. Do not show code in the chat. The \`generateTestFile\` tool is for creating unit tests for a specified file.
  4. The system will execute your tool call and return a result.
  5. After receiving the tool result, you MUST respond with a brief, non-technical summary for the user (e.g., "I've created the player file for you.").
  6. Your turn ends after you provide the summary. DO NOT call the same tool again in a loop.`,
        slogan: 'Launch the interactive game dev console',
        placeholder: 'e.g., "Create a player character in player.js"'
    },
    {
        id: 'sandbox',
        name: 'Code Sandbox',
        description: 'A live coding environment for any project. The AI can read, write, and update files in your workspace automatically.',
        isPro: false,
        icon: <CodeIcon />,
        system_prompt_segment: `You are an AI assistant in a Code Sandbox, an interactive development environment.
- Your goal is to help the user with their coding tasks by modifying files in their workspace.
- **Critical Workflow**:
  1. The user will request a change (e.g., create a file, add a function, generate tests) or provide a high-level goal using "/execute".
  2. If the user gives a high-level goal, you MUST first create a plan and then execute it step-by-step using the available tools.
  3. You MUST use the provided tools (\`createFile\`, \`updateFile\`, \`listFiles\`, \`generateTestFile\`) to fulfill the request. Do not show code in the chat. The \`generateTestFile\` tool is specifically for creating test files.
  4. The system will execute your tool call and return a result.
  5. After receiving the tool result, you MUST respond with a brief, non-technical summary for the user (e.g., "Okay, I've updated the CSS file.").
  6. Your turn ends after you provide the summary. DO NOT call the same tool again in a loop.`,
        slogan: 'Start a live coding session',
        placeholder: 'e.g., "/execute create an HTML file with a button"',
    },
    {
        id: 'widget_factory',
        name: 'Widget Factory',
        description: 'A creative space to generate and experiment with live UI components using AI.',
        isPro: true,
        icon: <MagicWandIcon />,
        system_prompt_segment: `You are an AI assistant in a Widget Factory, an interactive UI design environment. Your primary goal is to help the user create and iteratively refine React JSX widgets through conversation.
**Critical Workflow**:
1.  **Creation**: When the user asks to create a new component (e.g., "make me a clock"), you MUST use the \`createWidget\` tool.
    -   \`createWidget(prompt: string)\`: The prompt should be a clear, self-contained description for generating the widget. Example: \`createWidget({prompt: "A digital clock showing the current time, styled with a neon blue glow."})\`
2.  **Modification/Upgrade**: When the user asks to change the *currently selected* widget (e.g., "make it bigger"), you MUST use the \`updateWidget\` tool.
    -   \`updateWidget(widgetId: string, newPrompt: string)\`: You MUST provide the \`widgetId\` of the currently active widget. The \`newPrompt\` MUST be a new, complete description that incorporates the user's latest change into the previous description.
    -   **Example Interaction**:
        -   Previous prompt was: "A simple red button."
        -   User says: "add a shadow to it."
        -   Your tool call should be: \`updateWidget({widgetId: "some_id", newPrompt: "A simple red button with a shadow."})\`
3.  **Chat Response**: After every tool call, you MUST respond with a brief, friendly confirmation message.
- **DO NOT** output JSX code in the chat. Use the provided tools exclusively.`,
        slogan: 'Design & refine UI with AI chat',
        placeholder: 'e.g., "Create a login form"'
    },
];

export const CUSTOM_PERSONA_ICONS = [
    { id: 'robot', icon: <RobotIcon /> },
    { id: 'academic', icon: <AcademicIcon /> },
    { id: 'rocket', icon: <RocketIcon /> },
    { id: 'feather', icon: <FeatherIcon /> },
    { id: 'general', icon: <GeneralIcon /> },
    { id: 'code', icon: <CodeIcon /> },
    { id: 'game', icon: <GameIcon /> },
    { id: 'zen', icon: <ZenIcon /> },
    { id: 'pirate', icon: <PirateIcon /> },
];

export const resolvePersonaIcon = (icon: React.ReactNode | string): React.ReactNode => {
    if (typeof icon === 'string') {
        return CUSTOM_PERSONA_ICONS.find(i => i.id === icon)?.icon || <GeneralIcon />;
    }
    return icon;
}

const DEFAULT_THEME_STYLES = {
  typography: { fontFamily: "'Inter', sans-serif", monospaceFontFamily: "'Fira Code', monospace" },
  styles: { borderRadius: "0.5rem", spacing: "1rem" }
};

export const THEME_OPTIONS: Theme[] = [
    {
        id: 'default', name: 'Default Dark', isPro: false,
        colors: { appBg: '#111827', panelBg: '#1F2937', textPrimary: '#F9FAFB', textSecondary: '#9CA3AF', accent: '#8B5CF6', accentText: '#FFFFFF', border: '#374151', scrollbarThumb: '#4B5563' },
        ...DEFAULT_THEME_STYLES,
    },
    {
        id: 'aurora', name: 'Aurora', isPro: true,
        colors: { appBg: 'transparent', panelBg: 'rgba(31, 41, 55, 0.5)', textPrimary: '#F9FAFB', textSecondary: '#CBD5E1', accent: '#A78BFA', accentText: '#111827', border: 'rgba(255, 255, 255, 0.1)', scrollbarThumb: '#475569' },
        ...DEFAULT_THEME_STYLES,
    },
    {
        id: 'midnight', name: 'Midnight', isPro: true,
        colors: { appBg: '#0F172A', panelBg: '#1E293B', textPrimary: '#F8FAFC', textSecondary: '#94A3B8', accent: '#38BDF8', accentText: '#0F172A', border: '#334155', scrollbarThumb: '#475569' },
        ...DEFAULT_THEME_STYLES,
    },
    {
        id: 'forest', name: 'Forest', isPro: true,
        colors: { appBg: '#052e16', panelBg: '#064e3b', textPrimary: '#f0fdf4', textSecondary: '#a3e635', accent: '#4ade80', accentText: '#052e16', border: '#065f46', scrollbarThumb: '#14532d' },
        ...DEFAULT_THEME_STYLES,
    },
     {
        id: 'cyberpunk', name: 'Cyberpunk', isPro: true,
        colors: { appBg: '#0d0221', panelBg: '#0c001f', textPrimary: '#e0e1dd', textSecondary: '#8d909b', accent: '#00f6ff', accentText: '#0d0221', border: '#2A0B56', scrollbarThumb: '#ff00c1' },
        ...DEFAULT_THEME_STYLES,
    },
    {
        id: 'rose', name: 'Rosé', isPro: true,
        colors: { appBg: '#210b2c', panelBg: '#55286f', textPrimary: '#f3e8ff', textSecondary: '#e9d5ff', accent: '#d8b4fe', accentText: '#210b2c', border: '#7e22ce', scrollbarThumb: '#9333ea' },
        ...DEFAULT_THEME_STYLES,
    }
];

export const GOOGLE_FONTS = [
    { name: 'Inter', value: "'Inter', sans-serif", type: 'ui' },
    { name: 'Roboto', value: "'Roboto', sans-serif", type: 'ui' },
    { name: 'Lato', value: "'Lato', sans-serif", type: 'ui' },
    { name: 'Open Sans', value: "'Open Sans', sans-serif", type: 'ui' },
    { name: 'Fira Code', value: "'Fira Code', monospace", type: 'monospace' },
    { name: 'Source Code Pro', value: "'Source Code Pro', monospace", type: 'monospace' },
];

export const BORDER_RADIUS_OPTIONS = [
    { name: 'None', value: '0px' },
    { name: 'Small', value: '0.25rem' },
    { name: 'Medium', value: '0.5rem' },
    { name: 'Large', value: '0.75rem' },
    { name: 'Full', value: '9999px' },
];

export const SPACING_OPTIONS = [
    { name: 'Compact', value: '0.75rem' },
    { name: 'Comfortable', value: '1rem' },
    { name: 'Spacious', value: '1.25rem' },
];


export const MENTORX_CORE_CACHE = new Map<string, string>([
  ['hello', 'Hello! How can I assist you today?'],
  ['hi', 'Hi there! What can I do for you?'],
  ['how are you', 'I am MentorX, operating at peak efficiency. Thanks for asking!'],
  ['what is your name', 'I am MentorX, your personal AI mentor.'],
  ['thanks', 'You\'re welcome! Let me know if you need anything else.'],
  ['thank you', 'You\'re welcome! Is there anything else I can help with?'],
]);

export const ORIGINAL_SYSTEM_PROMPT_TOKEN_COUNT = 200; // Approx. tokens for the full prompt
export const COST_SAVER_SYSTEM_PROMPT_TOKEN_COUNT = 65; // Approx. tokens for the hyper-economical prompt

export const SUPPORTED_LANGUAGES = [
    { name: 'Python', value: 'python', extensions: '.py, .pyw' },
    { name: 'JavaScript', value: 'javascript', extensions: '.js, .mjs' },
    { name: 'TypeScript', value: 'typescript', extensions: '.ts, .tsx' },
    { name: 'Java', value: 'java', extensions: '.java, .class' },
    { name: 'C++', value: 'cpp', extensions: '.cpp, .h' },
    { name: 'C#', value: 'csharp', extensions: '.cs' },
    { name: 'Go', value: 'go', extensions: '.go' },
    { name: 'Rust', value: 'rust', extensions: '.rs' },
    { name: 'Ruby', value: 'ruby', extensions: '.rb' },
    { name: 'PHP', value: 'php', extensions: '.php' },
    { name: 'Swift', value: 'swift', extensions: '.swift' },
    { name: 'Kotlin', value: 'kotlin', extensions: '.kt, .kts' },
    { name: 'HTML', value: 'html', extensions: '.html, .htm' },
    { name: 'CSS', value: 'css', extensions: '.css' },
    { name: 'SQL', value: 'sql', extensions: '.sql' },
    { name: 'Shell', value: 'shell', extensions: '.sh, .bash' },
    { name: 'PowerShell', value: 'powershell', extensions: '.ps1' },
    { name: 'R', value: 'r', extensions: '.r' },
    { name: 'Perl', value: 'perl', extensions: '.pl, .pm' },
    { name: 'Lua', value: 'lua', extensions: '.lua' },
    { name: 'Scala', value: 'scala', extensions: '.scala, .sc' },
    { name: 'Haskell', value: 'haskell', extensions: '.hs' },
    { name: 'Dart', value: 'dart', extensions: '.dart' },
    { name: 'Elixir', value: 'elixir', extensions: '.ex, .exs' },
    { name: 'Clojure', value: 'clojure', extensions: '.clj, .cljs' },
    { name: 'F#', value: 'fsharp', extensions: '.fs, .fsx' },
    { name: 'Groovy', value: 'groovy', extensions: '.groovy' },
    { name: 'Julia', value: 'julia', extensions: '.jl' },
    { name: 'MATLAB', value: 'matlab', extensions: '.m' },
    { name: 'Objective-C', value: 'objective-c', extensions: '.m, .h' },
    { name: 'Zig', value: 'zig', extensions: '.zig' },
    { name: 'Markdown', value: 'markdown', extensions: '.md' },
];

export const COMMAND_PALETTE_COMMANDS: CommandPaletteCommand[] = [
    { id: 'cmd_new_chat', title: 'Start New Chat', category: 'Chat', icon: <PlusIcon/>, keywords: 'new chat conversation', action: 'new_chat' },
    ...MENTORX_PERSONAS.filter(p => p.slogan).map(p => ({
        id: `cmd_persona_${p.id}`,
        title: `New Chat: ${p.name}`,
        category: 'Chat',
        icon: p.icon,
        keywords: `new chat ${p.name} ${p.id}`,
        action: 'new_chat' as const,
        personaId: p.id,
        isPro: p.isPro
    })),
    { id: 'cmd_open_settings', title: 'Open Settings', category: 'Navigation', icon: <SettingsIcon/>, keywords: 'settings appearance options', action: 'open_settings' },
    { id: 'cmd_toggle_sidebar', title: 'Toggle Sidebar', category: 'Interface', icon: <SidebarCollapseIcon/>, keywords: 'sidebar panel hide show', action: 'toggle_sidebar' },
    { id: 'cmd_toggle_right_sidebar', title: 'Toggle Right Panel', category: 'Interface', icon: <BrainIcon/>, keywords: 'skills matrix dashboard panel hide show', action: 'toggle_right_sidebar' },
    { id: 'cmd_analyze_workspace', title: 'Analyze Workspace', category: 'Code', icon: <AnalyzeIcon/>, keywords: 'code review suggestions improve', action: 'perform_code_action', codeAction: 'analyze' },
];