import { ReactNode, Dispatch, SetStateAction } from 'react';

export interface CodeFile {
  id: string;
  name: string;
  code: string;
  language: string;
}

export interface WorkspaceState {
  files: CodeFile[];
  activeFileId: string | null;
  output: string;
  previewHtml: string | null;
}

export enum SkillId {
  LOGIC = 'LOGIC',
  CODING = 'CODING',
  CREATIVITY = 'CREATIVITY',
  EMPATHY = 'EMPATHY',
  KNOWLEDGE = 'KNOWLEDGE',
  PRODUCTIVITY = 'PRODUCTIVITY',
  RESEARCH = 'RESEARCH',
}

export interface Skill {
  id: SkillId;
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export type EvolutionState = Record<SkillId, Skill>;

export interface MentorXMode {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  relevantSkills: SkillId[];
  slogan: string;
  placeholder: string;
  type: 'chat' | 'image';
  isPro?: boolean;
}

export interface Source {
  uri: string;
  title: string;
}

export interface ToolCall {
    id: string;
    type: 'function';
    function: {
        name: string;
        arguments: Record<string, any>;
    };
}

export interface ToolResponsePart {
    toolCallId: string;
    functionName: string;
    response: Record<string, any>;
}

export interface FunctionDeclaration {
  name: string;
  description: string;
  parameters: object;
}

export interface Tool {
  functionDeclarations: FunctionDeclaration[];
}

export interface TaskStep {
    id: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
    toolCall?: ToolCall;
    toolResponse?: ToolResponsePart;
}

export interface Task {
    id: string;
    goal: string;
    plan: TaskStep[];
    status: 'planning' | 'in-progress' | 'completed' | 'failed';
    error?: string;
}

export interface Attachment {
  name: string;
  type: string;
  data: string; // base64 encoded
  size: number;
}


export interface ChatMessage {
  id:string;
  role: 'user' | 'assistant' | 'tool';
  text: string;
  timestamp: Date;
  sources?: Source[];
  attachment?: Attachment;
  tokens?: number;
  isCached?: boolean;
  toolCalls?: ToolCall[];
  toolResponses?: ToolResponsePart[];
  suggestedActions?: string[] | null;
}

export interface Persona {
    id: string;
    name: string;
    description: string;
    system_prompt_segment: string;
    isPro: boolean;
    icon: ReactNode | string; // Allow string for custom icons
    slogan?: string;
    placeholder?: string;
    isCustom?: boolean;
}

export interface AiWidget {
  id: string;
  prompt: string;
  jsx: string;
  lastUpdatedAt: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  modeId: string;
  isWebAccessEnabled: boolean;
  createdAt: Date;
  totalTokens?: number;
  isDeepAnalysis: boolean;
  activePersonaId?: string;
  workspaceState?: WorkspaceState;
  activeTask?: Task | null;
  widgets?: AiWidget[];
  activeWidgetId?: string | null;
  // AI Model Parameters
  temperature?: number;
  topP?: number;
  topK?: number;
}

export interface AppError {
    message: string;
    stack?: string;
}

export interface EfficiencyStats {
    apiCallsAvoided: number;
    tokensSaved: number;
}

export interface Theme {
    id: string;
    name: string;
    isPro: boolean;
    isCustom?: boolean;
    colors: {
        appBg: string;
        panelBg: string;
        textPrimary: string;
        textSecondary: string;
        accent: string;
        accentText: string;
        border: string;
        scrollbarThumb: string;
    };
    // New deep customization properties
    typography: {
      fontFamily: string;
      monospaceFontFamily: string;
    };
    styles: {
      borderRadius: string;
      spacing: string;
    }
}

export interface AppearanceSettings {
    activeThemeId: string;
    customThemes: Theme[];
    backgroundImage: string;
    backgroundOpacity: number;
    customCss: string;
}

export interface CommandPaletteCommand {
    id: string;
    title: string;
    category: string;
    icon: React.ReactNode;
    keywords: string;
    action?: 'new_chat' | 'open_settings' | 'toggle_sidebar' | 'toggle_right_sidebar' | 'perform_code_action' | 'generate_widget';
    personaId?: string;
    isPro?: boolean;
    codeAction?: 'refactor' | 'debug' | 'document' | 'explain' | 'test' | 'analyze';
}

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface UiSettings {
    isSidebarCollapsed: boolean;
    showRightSidebar: boolean;
    showSidebar: boolean;
    dashboardWidgetIds: string[];
}

export interface UserDataBundle {
    sessions: ChatSession[];
    customPersonas: Persona[];
    appearanceSettings: AppearanceSettings;
    customInstruction: string;
    uiSettings: UiSettings;
    evolutionState: EvolutionState;
    stats: EfficiencyStats;
}

export interface IMentorXContext {
  sessions: ChatSession[];
  activeSessionId: string | null;
  activeSession: ChatSession | null;
  evolutionState: EvolutionState;
  isLoading: boolean;
  isLowFidelityMode: boolean;
  isCostSaverMode: boolean;
  stats: EfficiencyStats;
  isPremiumUser: boolean;
  searchQuery: string;
  customInstruction: string;
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  saveStatus: 'idle' | 'saving' | 'saved';
  appearanceSettings: AppearanceSettings;
  theme: Theme;
  activePersona: Persona | null;
  customPersonas: Persona[];
  showRightSidebar: boolean;
  showSidebar: boolean;
  isCommandPaletteOpen: boolean;
  isSettingsOpen: boolean;
  isFocusMode: boolean;
  isRecording: boolean;
  dashboardWidgetIds: string[];
  user: User | null;
  isUserDataLoading: boolean;
  isTutorialActive: boolean;
  tutorialStep: number;
  startTutorial: () => void;
  nextTutorialStep: () => void;
  prevTutorialStep: () => void;
  endTutorial: () => void;
  login: (credential: string) => void;
  logout: () => void;
  addWidgetToDashboard: (widgetId: string) => void;
  removeWidgetFromDashboard: (widgetId: string) => void;
  startRecording: () => void;
  stopRecording: () => Promise<string | undefined>;
  setIsCommandPaletteOpen: Dispatch<SetStateAction<boolean>>;
  setIsSettingsOpen: Dispatch<SetStateAction<boolean>>;
  setIsFocusMode: Dispatch<SetStateAction<boolean>>;
  setShowRightSidebar: Dispatch<SetStateAction<boolean>>;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
  addCustomPersona: (persona: Omit<Persona, 'id' | 'isCustom' | 'isPro' | 'icon'> & {icon: string}) => void;
  updateCustomPersona: (persona: Persona) => void;
  deleteCustomPersona: (personaId: string) => void;
  setAppearanceSettings: (settings: Partial<AppearanceSettings>) => void;
  addCustomTheme: (theme: Omit<Theme, 'id' | 'isCustom' | 'isPro'>) => void;
  updateCustomTheme: (theme: Theme) => void;
  deleteCustomTheme: (themeId: string) => void;
  setSessionPersona: (sessionId: string, personaId: string) => void;
  setSessionModelParams: (sessionId: string, params: { temperature?: number, topP?: number, topK?: number }) => void;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  setIsSidebarCollapsed: Dispatch<SetStateAction<boolean>>;
  setCustomInstruction: Dispatch<SetStateAction<string>>;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  toggleLowFidelityMode: () => void;
  toggleCostSaverMode: () => void;
  startNewChat: (personaId: string) => void;
  deleteChat: (sessionId: string) => void;
  renameChat: (sessionId: string, newTitle: string) => void;
  setActiveSessionId: (sessionId: string | null) => void;
  sendMessage: (prompt: string, attachment?: Attachment | null, options?: { aspectRatio?: string; numberOfImages?: number; }, boosted?: boolean) => Promise<void>;
  editMessage: (sessionId: string, messageId: string, newText: string) => Promise<void>;
  regenerateLastResponse: (sessionId: string) => Promise<void>;
  toggleSessionWebAccess: (sessionId: string) => void;
  toggleSessionDeepAnalysis: (sessionId: string) => void;
  exportChat: (sessionId: string) => void;
  stopGeneration: () => void;
  // Code Canvas methods
  addCodeFile: (sessionId: string, fileName: string, code?: string) => any;
  deleteCodeFile: (sessionId:string, fileId: string) => void;
  renameCodeFile: (sessionId: string, fileId: string, newName: string) => void;
  setActiveCodeFile: (sessionId: string, fileId: string | null) => void;
  updateCodeFile: (sessionId: string, fileId: string, newCode: string, newLanguage?: string) => any;
  runCode: (sessionId: string) => Promise<void>;
  appendOutput: (sessionId: string, message: string) => void;
  performAiCodeAction: (sessionId: string, action: 'refactor' | 'debug' | 'document' | 'explain' | 'test' | 'analyze') => Promise<void>;
  executeTask: (sessionId: string, goal: string) => Promise<void>;
  uploadWorkspace: (sessionId: string) => Promise<void>;
  resetWorkspace: (sessionId: string) => void;
  // Widget Factory methods
  clearWidgets: (sessionId: string) => void;
  deleteWidget: (sessionId: string, widgetId: string) => void;
  setActiveWidgetId: (sessionId: string, widgetId: string | null) => void;
  generateAndAddWidget: (sessionId: string, prompt: string) => Promise<void>;
}