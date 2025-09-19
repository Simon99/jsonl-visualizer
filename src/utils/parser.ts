import type { JSONLEntry, TimelineEvent, MessageContent } from '../types/timeline';
import { EventType } from '../types/timeline';
import { isLocalTool, isServerTool } from '../config/toolConfig';

export class JSONLParser {
  static parseJSONL(content: string): JSONLEntry[] {
    const lines = content.trim().split('\n');
    const entries: JSONLEntry[] = [];

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const entry = JSON.parse(line) as JSONLEntry;
        entries.push(entry);
      } catch (error) {
        console.error('Failed to parse JSONL line:', error, line);
      }
    }

    return entries;
  }

  static convertToTimelineEvents(entries: JSONLEntry[]): TimelineEvent[] {
    const eventMap = new Map<string, TimelineEvent>();
    const rootEvents: TimelineEvent[] = [];
    const processedUuids = new Set<string>();

    // First pass: create all events without determining isLocal for tool results
    entries.forEach((entry, index) => {
      const event = this.createTimelineEvent(entry, index);
      eventMap.set(event.uuid, event);
    });

    // Second pass: fix tool result locations based on their parent
    entries.forEach((entry) => {
      const event = eventMap.get(entry.uuid);
      if (event && event.type === EventType.ToolResult && event.parentUuid) {
        const parent = eventMap.get(event.parentUuid);
        if (parent && parent.type === EventType.ToolRequest) {
          // Tool result should inherit location from its parent tool request
          event.isLocal = parent.isLocal;
        }
      }
    });

    // Third pass: build hierarchy - only group directly related events
    entries.forEach((entry, index) => {
      const event = eventMap.get(entry.uuid)!;

      if (processedUuids.has(event.uuid)) return;

      // Check if this is a direct child (tool result following tool request, etc.)
      if (event.type === EventType.ToolResult && event.parentUuid && eventMap.has(event.parentUuid)) {
        const parent = eventMap.get(event.parentUuid);
        if (parent && parent.type === EventType.ToolRequest) {
          parent.children.push(event);
          processedUuids.add(event.uuid);
          return;
        }
      }

      // Otherwise treat as root event
      rootEvents.push(event);
      processedUuids.add(event.uuid);
    });

    // Sort events and children by timestamp
    this.sortEventsByTimestamp(rootEvents);

    return rootEvents;
  }

  private static createTimelineEvent(entry: JSONLEntry, index: number): TimelineEvent {
    const timestamp = entry.timestamp ? new Date(entry.timestamp) : new Date();
    const type = this.determineEventType(entry);
    const isLocal = this.determineIsLocal(entry, type);

    return {
      id: `event-${index}`,
      uuid: entry.uuid,
      parentUuid: entry.parentUuid,
      timestamp,
      type,
      role: entry.message?.role,
      content: this.extractContent(entry),
      metadata: {
        model: entry.message?.model,
        sessionId: entry.sessionId,
        version: entry.version,
        cwd: entry.cwd,
        gitBranch: entry.gitBranch,
      },
      isLocal,
      children: [],
      expanded: false,
    };
  }

  private static determineEventType(entry: JSONLEntry): EventType {
    if (entry.type === 'summary') return EventType.Summary;
    if (entry.isMeta) return EventType.Meta;

    if (entry.message) {
      const { role, content } = entry.message;

      if (role === 'user') {
        if (Array.isArray(content)) {
          const hasToolResult = content.some(c => c.type === 'tool_result');
          if (hasToolResult) return EventType.ToolResult;
        }
        return EventType.UserMessage;
      }

      if (role === 'assistant') {
        if (Array.isArray(content)) {
          const hasToolUse = content.some(c => c.type === 'tool_use');
          if (hasToolUse) return EventType.ToolRequest;
        }
        return EventType.AssistantMessage;
      }

      if (role === 'system') return EventType.SystemMessage;
    }

    return EventType.UserMessage;
  }

  private static determineIsLocal(entry: JSONLEntry, type: EventType): boolean {
    // User messages are always local
    if (type === EventType.UserMessage) {
      return true;
    }

    // Assistant messages are always cloud
    if (type === EventType.AssistantMessage) {
      return false;
    }

    // Tool requests: check the tool name to determine location
    if (type === EventType.ToolRequest) {
      const toolName = this.extractToolName(entry);
      if (toolName) {
        if (isLocalTool(toolName)) return true;
        if (isServerTool(toolName)) return false;
      }
      // Default: tool requests are on cloud side
      return false;
    }

    // Tool results: will be fixed in second pass, default to local for now
    if (type === EventType.ToolResult) {
      return true; // Temporary, will be corrected in second pass
    }

    // Meta and summary are local
    if (type === EventType.Meta || type === EventType.Summary) {
      return true;
    }

    // Default based on entry type
    return entry.type === 'user';
  }

  private static extractToolName(entry: JSONLEntry): string | null {
    if (entry.message?.content && Array.isArray(entry.message.content)) {
      const toolUse = entry.message.content.find(c => c.type === 'tool_use');
      if (toolUse && 'name' in toolUse) {
        return toolUse.name;
      }
    }
    return null;
  }

  private static extractContent(entry: JSONLEntry): string | MessageContent[] {
    if (entry.summary) return entry.summary;

    if (entry.message) {
      if (typeof entry.message.content === 'string') {
        return entry.message.content;
      }
      return entry.message.content || [];
    }

    return '';
  }

  private static sortEventsByTimestamp(events: TimelineEvent[]): void {
    events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    events.forEach(event => {
      if (event.children.length > 0) {
        this.sortEventsByTimestamp(event.children);
      }
    });
  }

  static extractTextContent(content: string | MessageContent[]): string {
    if (typeof content === 'string') return content;

    if (Array.isArray(content)) {
      return content
        .map(item => {
          if (item.type === 'text') return item.text;
          if (item.type === 'tool_use') return `Tool: ${item.name}`;
          if (item.type === 'tool_result') return item.content;
          return '';
        })
        .join(' ');
    }

    return '';
  }
}