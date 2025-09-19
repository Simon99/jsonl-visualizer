import React, { useRef, useState } from 'react';
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

const Timeline: React.FC<TimelineProps> = ({ events, searchQuery, onEventClick }) => {
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
      [EventType.UserMessage]: 'border-timeline-user dark:border-timeline-dark-user',
      [EventType.AssistantMessage]: 'border-timeline-assistant dark:border-timeline-dark-assistant',
      [EventType.ToolRequest]: 'border-timeline-tool-request dark:border-timeline-dark-tool-request',
      [EventType.ToolResult]: 'border-timeline-tool-result dark:border-timeline-dark-tool-result',
      [EventType.SystemMessage]: 'border-timeline-metadata dark:border-timeline-dark-metadata',
      [EventType.Summary]: 'border-gray-500 dark:border-gray-400',
      [EventType.Meta]: 'border-timeline-metadata dark:border-timeline-dark-metadata',
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
    const text = JSONLParser.extractTextContent(content);

    if (!searchQuery) {
      return <span className="whitespace-pre-wrap break-words">{text}</span>;
    }

    // Highlight search matches
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);

    return (
      <span className="whitespace-pre-wrap break-words">
        {parts.map((part, index) =>
          regex.test(part) ? (
            <mark key={index} className="bg-yellow-300 dark:bg-yellow-700 px-1 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const renderEvent = (event: TimelineEvent, depth: number = 0): React.ReactNode => {
    const isExpanded = expandedEvents.has(event.uuid);
    const hasChildren = event.children.length > 0;
    const isLeft = event.isLocal;

    return (
      <div key={event.uuid} className="relative">
        {/* Event card container */}
        <div className={`grid grid-cols-2 gap-8 relative mb-8`}
             style={{ marginLeft: `${depth * 20}px` }}>
          {/* Left side */}
          {isLeft ? (
            <>
              <div className="flex justify-end">
                <div
                  className={`
                    relative p-4 rounded-lg shadow-md max-w-md
                    bg-white dark:bg-gray-800
                    border-l-4 ${getEventColor(event.type)}
                    hover:shadow-lg transition-shadow cursor-pointer
                  `}
                  onClick={() => onEventClick?.(event)}
                >
            {/* Header */}
            <div className="flex items-start gap-2 mb-2">
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                {getEventIcon(event)}
                <span>{event.role || event.type}</span>
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
                      Model: {event.metadata.model}
                    </div>
                  )}
                </div>
              </div>
              <div></div>
            </>
          ) : (
            <>
              <div></div>
              <div className="flex justify-start">
                <div
                  className={`
                    relative p-4 rounded-lg shadow-md max-w-md
                    bg-white dark:bg-gray-800
                    border-l-4 ${getEventColor(event.type)}
                    hover:shadow-lg transition-shadow cursor-pointer
                  `}
                  onClick={() => onEventClick?.(event)}
                >
                  {/* Header */}
                  <div className="flex items-start gap-2 mb-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      {getEventIcon(event)}
                      <span>{event.role || event.type}</span>
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
                      Model: {event.metadata.model}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Render children */}
        {isExpanded && hasChildren && (
          <div className="ml-8">
            {event.children.map(child => renderEvent(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={timelineRef} className="relative py-8">
      {/* Center line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 -translate-x-1/2" />

      {/* Timeline events */}
      <div className="space-y-4">
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

export default Timeline;