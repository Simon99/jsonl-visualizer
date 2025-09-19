export interface JSONLEntry {
  uuid: string;
  parentUuid: string | null;
  timestamp: string;
  type: 'user' | 'assistant' | 'summary' | string;
  message?: {
    id?: string;
    role: 'user' | 'assistant' | 'system';
    content: MessageContent[] | string;
    model?: string;
  };
  sessionId?: string;
  version?: string;
  cwd?: string;
  gitBranch?: string;
  isMeta?: boolean;
  isSidechain?: boolean;
  userType?: string;
  requestId?: string;
  leafUuid?: string;
  summary?: string;
}

export type MessageContent =
  | TextContent
  | ToolUseContent
  | ToolResultContent
  | ImageContent;

export interface TextContent {
  type: 'text';
  text: string;
}

export interface ToolUseContent {
  type: 'tool_use';
  id: string;
  name: string;
  input: any;
}

export interface ToolResultContent {
  type: 'tool_result';
  tool_use_id: string;
  content: string;
  is_error?: boolean;
}

export interface ImageContent {
  type: 'image';
  source: {
    type: string;
    media_type: string;
    data: string;
  };
}

export interface TimelineEvent {
  id: string;
  uuid: string;
  parentUuid: string | null;
  timestamp: Date;
  type: EventType;
  role?: 'user' | 'assistant' | 'system';
  content: string | MessageContent[];
  metadata?: {
    model?: string;
    sessionId?: string;
    version?: string;
    cwd?: string;
    gitBranch?: string;
  };
  isLocal: boolean;
  children: TimelineEvent[];
  expanded: boolean;
}

export const EventType = {
  UserMessage: 'user-message',
  AssistantMessage: 'assistant-message',
  ToolRequest: 'tool-request',
  ToolResult: 'tool-result',
  SystemMessage: 'system-message',
  Summary: 'summary',
  Meta: 'meta',
} as const;

export type EventType = typeof EventType[keyof typeof EventType];

export interface SearchResult {
  eventId: string;
  matches: Array<{
    text: string;
    startIndex: number;
    endIndex: number;
  }>;
}

export interface ExportOptions {
  format: 'markdown' | 'jsonl' | 'html';
  includeMetadata: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  eventTypes?: EventType[];
}