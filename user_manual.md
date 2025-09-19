# JSONL Timeline Visualizer - User Manual

## Table of Contents
1. [Getting Started](#getting-started)
2. [Loading JSONL Files](#loading-jsonl-files)
3. [Understanding the Timeline](#understanding-the-timeline)
4. [Navigation and Interaction](#navigation-and-interaction)
5. [Search Functionality](#search-functionality)
6. [Export Features](#export-features)
7. [Dark Mode](#dark-mode)
8. [Understanding Event Types](#understanding-event-types)
9. [Tool Location Indicators](#tool-location-indicators)
10. [Troubleshooting](#troubleshooting)

## Getting Started

### Opening the Application
1. Launch your web browser
2. Navigate to `http://localhost:5173` (development) or your deployed URL
3. The application will open with an empty timeline

### First Time Usage
When you first open the application, you'll see:
- A header with the application title
- An upload button to load JSONL files
- Search bar (inactive until a file is loaded)
- Empty timeline area

## Loading JSONL Files

### Uploading Files
1. Click the **"Upload JSONL"** button in the header
2. Select a `.jsonl` file from your computer
3. The file will be automatically parsed and displayed

### Supported File Format
The application expects JSONL files with the following structure:
```json
{"uuid":"...","timestamp":"...","message":{...},"type":"..."}
```

Each line should be a valid JSON object representing a conversation event.

### File Size Limitations
- Recommended maximum file size: 50MB
- Larger files may cause performance issues

## Understanding the Timeline

### Timeline Layout
The timeline uses a **left-right layout** to distinguish between:
- **Left Side (Local)**: Operations executed on your local machine
  - User messages
  - Local tools (Read, Write, Edit, Bash, etc.)
  - Meta information
- **Right Side (Server/Cloud)**: Operations executed on the server
  - Assistant responses
  - Cloud tools (WebSearch, WebFetch, Task)
  - API calls

### Visual Elements
- **Center Line**: Vertical line separating local and server events
- **Time Nodes**: Circular markers on the center line for each event
- **Event Cards**: Detailed information boxes for each event
- **Connecting Lines**: Show relationships between related events

## Navigation and Interaction

### Scrolling
- Use mouse wheel or trackpad to scroll through the timeline
- Events are displayed chronologically from top to bottom

### Expanding/Collapsing Events
- Click the **chevron icon** (▶/▼) to expand or collapse nested events
- Tool requests and their results can be expanded to show details

### Clicking Event Cards
- Click on any event card to view additional details
- Links within events are clickable and open in new tabs

### Keyboard Shortcuts
- `Ctrl/Cmd + F`: Focus on search bar
- `Escape`: Clear search
- `Ctrl/Cmd + D`: Toggle dark mode

## Search Functionality

### Basic Search
1. Type your search query in the search bar
2. Results are highlighted in real-time
3. Matching text appears with yellow background

### Search Tips
- Search is case-insensitive
- Searches across all event content
- Special characters are treated literally
- Clear search by clicking the X button or pressing Escape

## Export Features

### Available Export Formats

#### Markdown Export
1. Click the **"Export"** button
2. Select **"Export as Markdown"**
3. Creates a readable document with:
   - Chronological event listing
   - Formatted conversations
   - Tool usage details
   - Metadata information

#### HTML Export
1. Click the **"Export"** button
2. Select **"Export as HTML"**
3. Generates a standalone HTML file with:
   - Styled timeline view
   - Interactive elements preserved
   - Self-contained CSS

#### JSONL Export
1. Click the **"Export"** button
2. Select **"Export as JSONL"**
3. Downloads the original or filtered data
4. Useful for data backup or sharing

### Export Options
- **Export All**: Exports complete timeline
- **Export Filtered**: When search is active, exports only matching events

## Dark Mode

### Toggling Dark Mode
- Click the **moon/sun icon** in the top-right corner
- The interface will switch between light and dark themes
- Your preference is saved in browser storage

### Dark Mode Features
- Optimized colors for reduced eye strain
- High contrast for better readability
- All UI elements properly themed

## Understanding Event Types

### User Messages
- **Color**: Blue border
- **Icon**: Monitor (local)
- **Content**: User input text

### Assistant Messages
- **Color**: Green border
- **Icon**: Cloud
- **Content**: AI responses

### Tool Requests
- **Color**: Purple border
- **Icon**: Cloud or Monitor (depends on tool)
- **Content**: Tool name and parameters
- **Expandable**: Click to see tool details

### Tool Results
- **Color**: Orange border
- **Icon**: Inherits from parent tool request
- **Content**: Tool execution results
- **Special Rendering**:
  - WebSearch results show as clickable links
  - File paths are highlighted
  - Code blocks are formatted

### System Messages
- **Color**: Gray border
- **Content**: System notifications

### Meta Information
- **Color**: Gray border
- **Icon**: Monitor (local)
- **Content**: Session metadata

## Tool Location Indicators

### Local Tools (Left Side)
Tools executed on your machine:
- `TodoWrite` - Task management
- `Read` - File reading
- `Write` - File writing
- `Edit` - File editing
- `MultiEdit` - Multiple edits
- `Bash` - Shell commands
- `Glob` - File pattern matching
- `Grep` - Text search

### Server Tools (Right Side)
Tools executed on the cloud:
- `WebSearch` - Internet searches
- `WebFetch` - Web page fetching
- `Task` - Complex task execution

### Browser Tools (Left Side)
Playwright automation tools:
- `mcp__playwright__browser_*` - Browser automation commands

## Troubleshooting

### File Won't Load
- **Check file format**: Ensure it's valid JSONL
- **Check file size**: Large files may timeout
- **Check browser console**: Look for error messages

### Timeline Not Displaying Correctly
- **Refresh the page**: Clear any cached state
- **Check zoom level**: Reset browser zoom to 100%
- **Try different browser**: Ensure browser compatibility

### Search Not Working
- **Clear search field**: Start with empty search
- **Check for special characters**: Some may need escaping
- **Refresh if frozen**: Reload the page

### Export Not Working
- **Check popup blocker**: May block download
- **Check disk space**: Ensure sufficient space
- **Try different format**: Some formats may work better

### Performance Issues
- **Large files**: Consider splitting into smaller files
- **Many events expanded**: Collapse unused sections
- **Clear browser cache**: Remove old cached data
- **Close other tabs**: Free up browser memory

## Tips and Best Practices

1. **Start with collapsed view**: Expand only what you need
2. **Use search effectively**: Find specific conversations quickly
3. **Export regularly**: Save important conversations
4. **Monitor performance**: Close large files when done
5. **Use dark mode**: Reduce eye strain during long sessions

## Support

For additional help or to report issues:
1. Check the README.md for technical details
2. Open an issue on the GitHub repository
3. Contact the development team

---

*Version 1.0.0 - Last updated: 2025*