# JSONL Timeline Visualizer

A React-based web application for visualizing and analyzing JSONL conversation logs from Claude interactions. This tool provides an intuitive timeline interface to explore conversations between users and AI assistants, including tool usage and responses.

## Features

- 📊 **Interactive Timeline View**: Visual representation of conversations with left/right separation for local vs. server operations
- 🔍 **Search Functionality**: Full-text search across all events
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
git clone <repository-url>
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

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 3** - Styling
- **Lucide React** - Icons
- **date-fns** - Date formatting

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