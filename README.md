# JSONL Timeline Visualizer

**English** | [繁體中文](./README.zh-TW.md) | [简体中文](./README.zh-CN.md)

A React-based web application for visualizing and analyzing JSONL conversation logs from Claude interactions. This tool provides an intuitive timeline interface to explore conversations between users and AI assistants, including tool usage and responses.

## Features

- 📊 **Interactive Timeline View**: Visual representation of conversations with left/right separation for local vs. server operations
- 🔍 **Search Functionality**: Full-text search across all events
- 🌏 **Multi-language Support**: Auto-detects browser language (English, Traditional Chinese, Simplified Chinese)
- 🎨 **Dark Mode Support**: Toggle between light and dark themes
- 📁 **Multiple Export Formats**: Export to Markdown, HTML, or JSONL
- 🔧 **Tool Recognition**: Automatically identifies and categorizes local vs. server-side tools
- 🔗 **Smart Link Rendering**: Clickable links with title display for web search results
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Installation

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager

### Setup

1. Clone the repository:
```bash
git clone https://github.com/julung/jsonl-visualizer.git
cd jsonl-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## Live Demo

You can also use the deployed version on GitHub Pages:
[https://julung.github.io/jsonl-visualizer/](https://julung.github.io/jsonl-visualizer/)

## Production Build

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

To preview the production build:
```bash
npm run preview
```

To deploy to GitHub Pages:
```bash
npm run deploy
```

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 3** - Styling
- **Lucide React** - Icons
- **date-fns** - Date formatting
- **i18next** - Internationalization support

## Project Structure

```
jsonl-visualizer/
├── src/
│   ├── components/
│   │   ├── Timeline.tsx       # Main timeline component
│   │   ├── TimelineSimple.tsx # Simplified timeline view
│   │   └── EventCard.tsx      # Event display component
│   ├── utils/
│   │   ├── parser.ts          # JSONL parsing logic
│   │   └── exporter.ts        # Export functionality
│   ├── config/
│   │   └── toolConfig.ts      # Tool location configuration
│   ├── types/
│   │   └── timeline.ts        # TypeScript definitions
│   ├── locales/              # Translation files
│   │   ├── en.json           # English
│   │   ├── zh-TW.json        # Traditional Chinese
│   │   └── zh-CN.json        # Simplified Chinese
│   ├── i18n.ts               # Internationalization configuration
│   └── App.tsx                # Main application component
├── public/                    # Static assets
└── package.json              # Project dependencies
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Contact

For questions or support, please open an issue on GitHub.