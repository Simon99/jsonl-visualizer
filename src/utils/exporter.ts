import { saveAs } from 'file-saver';
import type { TimelineEvent, ExportOptions } from '../types/timeline';
import { format } from 'date-fns';
import { JSONLParser } from './parser';

export function exportData(events: TimelineEvent[], options: ExportOptions): void {
  const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
  const filename = `timeline_export_${timestamp}`;

  switch (options.format) {
    case 'markdown':
      exportAsMarkdown(events, filename, options);
      break;
    case 'jsonl':
      exportAsJSONL(events, filename, options);
      break;
    case 'html':
      exportAsHTML(events, filename, options);
      break;
  }
}

function exportAsMarkdown(events: TimelineEvent[], filename: string, options: ExportOptions): void {
  const lines: string[] = ['# Timeline Export', ''];

  const processEvent = (event: TimelineEvent, depth: number = 0) => {
    const indent = '  '.repeat(depth);
    const timestamp = format(event.timestamp, 'yyyy-MM-dd HH:mm:ss.SSS');
    const location = event.isLocal ? '📱 Local' : '☁️ Cloud';

    lines.push(`${indent}- **[${timestamp}]** ${location} - ${event.type}`);

    const content = JSONLParser.extractTextContent(event.content);
    if (content) {
      lines.push(`${indent}  ${content.substring(0, 200)}${content.length > 200 ? '...' : ''}`);
    }

    if (options.includeMetadata && event.metadata?.model) {
      lines.push(`${indent}  *Model: ${event.metadata.model}*`);
    }

    lines.push('');

    event.children.forEach(child => processEvent(child, depth + 1));
  };

  events.forEach(event => processEvent(event));

  const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
  saveAs(blob, `${filename}.md`);
}

function exportAsJSONL(events: TimelineEvent[], filename: string, options: ExportOptions): void {
  const lines: string[] = [];

  const processEvent = (event: TimelineEvent) => {
    const jsonEvent = {
      uuid: event.uuid,
      parentUuid: event.parentUuid,
      timestamp: event.timestamp.toISOString(),
      type: event.type,
      role: event.role,
      content: event.content,
      metadata: options.includeMetadata ? event.metadata : undefined,
      isLocal: event.isLocal,
    };

    lines.push(JSON.stringify(jsonEvent));
    event.children.forEach(processEvent);
  };

  events.forEach(processEvent);

  const blob = new Blob([lines.join('\n')], { type: 'application/json' });
  saveAs(blob, `${filename}.jsonl`);
}

function exportAsHTML(events: TimelineEvent[], filename: string, options: ExportOptions): void {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Timeline Export - ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .header {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .timeline {
            position: relative;
            padding: 20px 0;
        }
        .timeline::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 2px;
            background: #ddd;
            transform: translateX(-50%);
        }
        .event {
            position: relative;
            margin: 20px 0;
            display: flex;
        }
        .event.local {
            justify-content: flex-end;
            padding-right: 51%;
        }
        .event.cloud {
            justify-content: flex-start;
            padding-left: 51%;
        }
        .event-card {
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            max-width: 500px;
            border-left: 4px solid;
        }
        .event.local .event-card {
            border-left-color: #0056b3;
        }
        .event.cloud .event-card {
            border-left-color: #28a745;
        }
        .event-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            font-size: 0.875rem;
            color: #666;
        }
        .event-content {
            color: #333;
            line-height: 1.5;
        }
        .event-metadata {
            margin-top: 10px;
            font-size: 0.75rem;
            color: #999;
        }
        .stats {
            display: flex;
            gap: 30px;
            margin-top: 20px;
        }
        .stat {
            display: flex;
            flex-direction: column;
        }
        .stat-label {
            font-size: 0.875rem;
            color: #666;
        }
        .stat-value {
            font-size: 1.5rem;
            font-weight: bold;
            color: #333;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Timeline Export</h1>
        <div class="stats">
            <div class="stat">
                <span class="stat-label">Total Events</span>
                <span class="stat-value">${countEvents(events)}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Local Events</span>
                <span class="stat-value">${countEventsByLocation(events, true)}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Cloud Events</span>
                <span class="stat-value">${countEventsByLocation(events, false)}</span>
            </div>
        </div>
    </div>
    <div class="timeline">
        ${renderHTMLEvents(events, options)}
    </div>
</body>
</html>
  `;

  const blob = new Blob([html], { type: 'text/html' });
  saveAs(blob, `${filename}.html`);
}

function renderHTMLEvents(events: TimelineEvent[], options: ExportOptions): string {
  const html: string[] = [];

  const processEvent = (event: TimelineEvent, depth: number = 0) => {
    const timestamp = format(event.timestamp, 'HH:mm:ss.SSS');
    const content = JSONLParser.extractTextContent(event.content);
    const location = event.isLocal ? 'local' : 'cloud';
    const icon = event.isLocal ? '📱' : '☁️';

    html.push(`
      <div class="event ${location}" style="margin-left: ${depth * 20}px">
        <div class="event-card">
          <div class="event-header">
            <span>${icon} ${event.type}</span>
            <span>${timestamp}</span>
          </div>
          <div class="event-content">
            ${escapeHtml(content.substring(0, 500))}${content.length > 500 ? '...' : ''}
          </div>
          ${options.includeMetadata && event.metadata?.model ? `
            <div class="event-metadata">
              Model: ${event.metadata.model}
            </div>
          ` : ''}
        </div>
      </div>
    `);

    event.children.forEach(child => processEvent(child, depth + 1));
  };

  events.forEach(event => processEvent(event));
  return html.join('');
}

function countEvents(events: TimelineEvent[]): number {
  let count = events.length;
  events.forEach(event => {
    count += countEvents(event.children);
  });
  return count;
}

function countEventsByLocation(events: TimelineEvent[], isLocal: boolean): number {
  let count = events.filter(e => e.isLocal === isLocal).length;
  events.forEach(event => {
    count += countEventsByLocation(event.children, isLocal);
  });
  return count;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}