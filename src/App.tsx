import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Download, Search, Moon, Sun, FileText, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Timeline from './components/TimelineSimple';
import { JSONLParser } from './utils/parser';
import type { TimelineEvent, ExportOptions } from './types/timeline';
import { exportData } from './utils/exporter';

function App() {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<TimelineEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalEvents: 0,
    userMessages: 0,
    assistantMessages: 0,
    toolCalls: 0,
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setFileName(file.name);

    try {
      const content = await file.text();
      const entries = JSONLParser.parseJSONL(content);
      const timelineEvents = JSONLParser.convertToTimelineEvents(entries);

      setEvents(timelineEvents);
      setFilteredEvents(timelineEvents);

      // Calculate stats
      const flatEvents = getAllEvents(timelineEvents);
      setStats({
        totalEvents: flatEvents.length,
        userMessages: flatEvents.filter(e => e.type === 'user-message').length,
        assistantMessages: flatEvents.filter(e => e.type === 'assistant-message').length,
        toolCalls: flatEvents.filter(e => e.type === 'tool-request' || e.type === 'tool-result').length,
      });
    } catch (error) {
      console.error('Failed to parse JSONL file:', error);
      alert('Failed to parse JSONL file. Please check the file format.');
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllEvents = (events: TimelineEvent[]): TimelineEvent[] => {
    const result: TimelineEvent[] = [];
    const traverse = (event: TimelineEvent) => {
      result.push(event);
      event.children.forEach(traverse);
    };
    events.forEach(traverse);
    return result;
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredEvents(events);
      return;
    }

    const searchLower = query.toLowerCase();
    const filterEvents = (events: TimelineEvent[]): TimelineEvent[] => {
      return events.filter(event => {
        const text = JSONLParser.extractTextContent(event.content).toLowerCase();
        const matches = text.includes(searchLower);
        const childrenMatch = filterEvents(event.children);

        if (matches || childrenMatch.length > 0) {
          return {
            ...event,
            children: childrenMatch,
          };
        }
        return false;
      });
    };

    setFilteredEvents(filterEvents(events));
  }, [events]);

  const handleExport = useCallback((format: 'markdown' | 'jsonl' | 'html') => {
    const options: ExportOptions = {
      format,
      includeMetadata: true,
    };
    exportData(filteredEvents, options);
  }, [filteredEvents]);

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    let nextLang = 'en';
    if (currentLang === 'en') {
      nextLang = 'zh-TW';
    } else if (currentLang === 'zh-TW') {
      nextLang = 'zh-CN';
    }
    i18n.changeLanguage(nextLang);
  };

  const clearData = () => {
    setEvents([]);
    setFilteredEvents([]);
    setSearchQuery('');
    setFileName(null);
    setStats({
      totalEvents: 0,
      userMessages: 0,
      assistantMessages: 0,
      toolCalls: 0,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {t('app.title')}
              </h1>
              {fileName && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <FileText className="w-4 h-4" />
                  <span>{fileName}</span>
                  <button
                    onClick={clearData}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('app.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* File Upload */}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".jsonl"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>{t('app.uploadButton')}</span>
                </div>
              </label>

              {/* Export */}
              {events.length > 0 && (
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>{t('app.export')}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <button
                      onClick={() => handleExport('markdown')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                    >
                      {t('app.exportMarkdown')}
                    </button>
                    <button
                      onClick={() => handleExport('jsonl')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {t('app.exportJSONL')}
                    </button>
                    <button
                      onClick={() => handleExport('html')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                    >
                      {t('app.exportHTML')}
                    </button>
                  </div>
                </div>
              )}

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title={i18n.language}
              >
                <Globe className="w-5 h-5" />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Stats */}
          {events.length > 0 && (
            <div className="flex gap-6 mt-4 text-sm text-gray-600 dark:text-gray-400">
              <div>{t('app.stats.total')}: <span className="font-semibold">{stats.totalEvents}</span></div>
              <div>{t('app.stats.user')}: <span className="font-semibold">{stats.userMessages}</span></div>
              <div>{t('app.stats.assistant')}: <span className="font-semibold">{stats.assistantMessages}</span></div>
              <div>{t('app.stats.tools')}: <span className="font-semibold">{stats.toolCalls}</span></div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : events.length > 0 ? (
          <Timeline events={filteredEvents} searchQuery={searchQuery} />
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-gray-500 dark:text-gray-400">
            <Upload className="w-16 h-16 mb-4" />
            <p className="text-lg">{t('app.upload.title')}</p>
            <p className="text-sm mt-2">{t('app.upload.subtitle')}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
