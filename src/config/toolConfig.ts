// Configuration for tool locations (local vs server)
export const TOOL_CONFIG = {
  // Tools that run locally on the user's machine
  localTools: [
    'TodoWrite',
    'Read',
    'Write',
    'Edit',
    'MultiEdit',
    'NotebookEdit',
    'Bash',
    'BashOutput',
    'KillShell',
    'Glob',
    'Grep',
    'ExitPlanMode',
  ],

  // Tools that run on the server/cloud
  serverTools: [
    'WebSearch',
    'WebFetch',
    'Task',
  ],

  // Browser automation tools (could be considered local)
  browserTools: [
    'mcp__playwright__browser_navigate',
    'mcp__playwright__browser_click',
    'mcp__playwright__browser_type',
    'mcp__playwright__browser_snapshot',
    'mcp__playwright__browser_take_screenshot',
    'mcp__playwright__browser_file_upload',
    // Add other playwright tools as needed
  ]
};

export function isLocalTool(toolName: string): boolean {
  return TOOL_CONFIG.localTools.includes(toolName) ||
         TOOL_CONFIG.browserTools.includes(toolName);
}

export function isServerTool(toolName: string): boolean {
  return TOOL_CONFIG.serverTools.includes(toolName);
}