import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TimelineEvent } from '../types/timeline';
import { EventType } from '../types/timeline';
import { format } from 'date-fns';
import { ChevronDown, ChevronRight, Cloud, Monitor, AlertCircle } from 'lucide-react';
import { JSONLParser } from '../utils/parser';

interface TimelineProps {
  events: TimelineEvent[];
  searchQuery?: string;
  onEventClick?: (event: TimelineEvent) => void;
}

const TimelineSimple: React.FC<TimelineProps> = ({ events, searchQuery, onEventClick }) => {
  const { t } = useTranslation();
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const timelineRef = useRef<HTMLDivElement>(null);

  const toggleExpand = (eventId: string) => {
    setExpandedEvents(prev => {
      const next = new Set(prev);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      return next;
    });
  };

  const getEventColor = (type: EventType): string => {
    const colorMap = {
      [EventType.UserMessage]: 'border-blue-500',
      [EventType.AssistantMessage]: 'border-green-500',
      [EventType.ToolRequest]: 'border-purple-500',
      [EventType.ToolResult]: 'border-orange-500',
      [EventType.SystemMessage]: 'border-gray-500',
      [EventType.Summary]: 'border-gray-400',
      [EventType.Meta]: 'border-gray-500',
    };
    return colorMap[type] || 'border-gray-400';
  };

  const getEventIcon = (event: TimelineEvent) => {
    if (event.isLocal) {
      return <Monitor className="w-4 h-4" />;
    }
    return <Cloud className="w-4 h-4" />;
  };

  const renderContent = (content: string | any[]): React.ReactNode => {
    // Handle structured content with potential links
    if (Array.isArray(content)) {
      return (
        <div className="space-y-2">
          {content.map((item, index) => {
            if (item.type === 'text') {
              return <div key={index} className="whitespace-pre-wrap break-words">{highlightText(item.text)}</div>;
            } else if (item.type === 'tool_use') {
              return (
                <div key={index} className="font-medium text-purple-600 dark:text-purple-400">
                  {t('app.tool')}: {item.name}
                </div>
              );
            } else if (item.type === 'tool_result') {
              // Check if content contains Links: JSON array (search results)
              if (typeof item.content === 'string' && item.content.includes('Links: [{')) {
                // Parse ALL Links JSON arrays in the content
                const parts: React.ReactNode[] = [];
                let remainingContent = item.content;
                let partIndex = 0;

                while (remainingContent.includes('Links: [{')) {
                  const linksStartIndex = remainingContent.indexOf('Links: [{');
                  const beforeLinks = remainingContent.substring(0, linksStartIndex);

                  // Add text before links
                  if (beforeLinks.trim()) {
                    parts.push(
                      <div key={`text-${partIndex++}`} className="whitespace-pre-wrap break-words text-sm">
                        {highlightText(beforeLinks.trim())}
                      </div>
                    );
                  }

                  // Try to extract the JSON array
                  let jsonEndIndex = -1;
                  let bracketCount = 0;
                  let inString = false;
                  let escapeNext = false;

                  for (let i = linksStartIndex + 7; i < remainingContent.length; i++) {
                    const char = remainingContent[i];

                    if (escapeNext) {
                      escapeNext = false;
                      continue;
                    }

                    if (char === '\\') {
                      escapeNext = true;
                      continue;
                    }

                    if (char === '"' && !escapeNext) {
                      inString = !inString;
                    }

                    if (!inString) {
                      if (char === '[') bracketCount++;
                      if (char === ']') {
                        bracketCount--;
                        if (bracketCount === 0) {
                          jsonEndIndex = i + 1;
                          break;
                        }
                      }
                    }
                  }

                  if (jsonEndIndex > 0) {
                    const jsonString = remainingContent.substring(linksStartIndex + 7, jsonEndIndex);
                    try {
                      const links = JSON.parse(jsonString);
                      parts.push(
                        <div key={`links-${partIndex++}`} className="space-y-1 pl-2 border-l-2 border-gray-200 dark:border-gray-700">
                          {links.map((link: any, linkIndex: number) => (
                            <div key={linkIndex} className="text-sm py-1">
                              <div className="font-medium text-gray-700 dark:text-gray-300">
                                {link.title}
                              </div>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {link.url}
                              </a>
                            </div>
                          ))}
                        </div>
                      );
                      remainingContent = remainingContent.substring(jsonEndIndex);
                    } catch (e) {
                      // If parsing fails, treat as plain text
                      const nextLinksIndex = remainingContent.indexOf('Links: [{', linksStartIndex + 1);
                      const textEnd = nextLinksIndex > 0 ? nextLinksIndex : remainingContent.length;
                      parts.push(
                        <div key={`text-${partIndex++}`} className="whitespace-pre-wrap break-words text-sm">
                          {highlightText(remainingContent.substring(0, textEnd))}
                        </div>
                      );
                      remainingContent = remainingContent.substring(textEnd);
                    }
                  } else {
                    // No valid JSON found, treat rest as plain text
                    parts.push(
                      <div key={`text-${partIndex++}`} className="whitespace-pre-wrap break-words text-sm">
                        {highlightText(remainingContent)}
                      </div>
                    );
                    break;
                  }
                }

                // Add any remaining content
                if (remainingContent.trim()) {
                  parts.push(
                    <div key={`text-${partIndex++}`} className="whitespace-pre-wrap break-words text-sm">
                      {highlightText(remainingContent.trim())}
                    </div>
                  );
                }

                return <div key={index} className="space-y-2">{parts}</div>;
              }
              // Check if content contains /url: format (playwright snapshots)
              else if (typeof item.content === 'string' && item.content.includes('/url:')) {
                const lines = item.content.split('\n');
                return (
                  <div key={index} className="space-y-1 text-sm">
                    {lines.map((line: string, lineIndex: number) => {
                      const urlMatch = line.match(/^\s*-\s*\/url:\s*(.+)/);
                      if (urlMatch) {
                        const url = urlMatch[1].trim();
                        return (
                          <div key={lineIndex} className="pl-4">
                            <span className="text-gray-600 dark:text-gray-400">URL: </span>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {url}
                            </a>
                          </div>
                        );
                      }
                      return <div key={lineIndex}>{highlightText(line)}</div>;
                    })}
                  </div>
                );
              }
              return <div key={index} className="whitespace-pre-wrap break-words">{highlightText(item.content)}</div>;
            }
            return null;
          })}
        </div>
      );
    }

    // Handle string content
    const text = typeof content === 'string' ? content : JSONLParser.extractTextContent(content);
    return <span className="whitespace-pre-wrap break-words">{highlightText(text)}</span>;
  };

  const highlightText = (text: string): React.ReactNode => {
    if (!searchQuery || !text) return text;

    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <mark key={index} className="bg-yellow-300 dark:bg-yellow-700 px-1 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const renderEventCard = (event: TimelineEvent) => {
    const isExpanded = expandedEvents.has(event.uuid);
    const hasChildren = event.children.length > 0;

    return (
      <div
        className={`
          relative p-4 rounded-lg shadow-md
          bg-white dark:bg-gray-800
          border-l-4 ${getEventColor(event.type)}
          hover:shadow-lg transition-shadow cursor-pointer
          max-w-md w-full
        `}
        onClick={() => onEventClick?.(event)}
      >
        {/* Header */}
        <div className="flex items-start gap-2 mb-2">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            {getEventIcon(event)}
            <span>
              {event.type === EventType.ToolResult
                ? 'tool_result'
                : (event.role ? t(`app.roles.${event.role}`) : event.type)}
            </span>
          </div>
          <div className="ml-auto text-xs text-gray-400 dark:text-gray-500">
            {event.timestamp instanceof Date && !isNaN(event.timestamp.getTime())
              ? format(event.timestamp, 'HH:mm:ss.SSS')
              : 'Invalid date'}
          </div>
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(event.uuid);
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {renderContent(event.content)}
        </div>

        {/* Metadata */}
        {event.metadata?.model && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {t('app.model')}: {event.metadata.model}
          </div>
        )}
      </div>
    );
  };

  const renderEvent = (event: TimelineEvent, depth: number = 0): React.ReactNode => {
    const isExpanded = expandedEvents.has(event.uuid);
    const hasChildren = event.children.length > 0;
    const isLeft = event.isLocal;

    return (
      <div key={event.uuid} className="relative">
        {/* Event row with two columns */}
        <div className="flex gap-8 mb-6" style={{ paddingLeft: `${depth * 2}rem` }}>
          {/* Left column */}
          <div className="flex-1 flex justify-end">
            {isLeft && renderEventCard(event)}
          </div>

          {/* Center line indicator */}
          <div className="relative flex items-center">
            <div className="w-4 h-4 bg-white dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-full z-10"></div>
          </div>

          {/* Right column */}
          <div className="flex-1 flex justify-start">
            {!isLeft && renderEventCard(event)}
          </div>
        </div>

        {/* Render children */}
        {isExpanded && hasChildren && (
          <div>
            {event.children.map(child => renderEvent(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={timelineRef} className="relative py-8 max-w-6xl mx-auto">
      {/* Center line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 -translate-x-1/2 z-0" />

      {/* Timeline events */}
      <div>
        {events.map(event => renderEvent(event))}
      </div>

      {events.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
          <AlertCircle className="w-12 h-12 mb-4" />
          <p>No events to display</p>
        </div>
      )}
    </div>
  );
};

export default TimelineSimple;