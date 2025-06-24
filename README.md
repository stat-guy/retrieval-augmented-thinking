# RAT MCP Server (Node.js)

Retrieval Augmented Thinking MCP Server - A reasoning tool that processes structured thoughts with metrics, branching, and revision capabilities.

## Installation

### Simple 3-Step Process
```bash
git clone https://github.com/stat-guy/retrieval-augmented-thinking.git
cd retrieval-augmented-thinking
npm install -g .
```

### Verify Installation
Test that the installation worked:
```bash
npx mcp-server-rat-node --help
```

**Success indicator:** If you see `RAT MCP Server (Node.js) running on stdio`, your installation is ready!

## Claude Desktop Configuration

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "retrieval-augmented-thinking": {
      "command": "npx",
      "args": ["mcp-server-rat-node"]
    }
  }
}
```

After adding the configuration, restart Claude Desktop to load the RAT server.

## Usage

The server provides a single `rat` tool for processing structured thoughts:

```javascript
// Basic usage
{
  "thought": "I need to analyze this problem step by step...",
  "nextThoughtNeeded": true,
  "thoughtNumber": 1,
  "totalThoughts": 3
}

// With revision
{
  "thought": "Let me reconsider my previous analysis...",
  "nextThoughtNeeded": false,
  "thoughtNumber": 2,
  "totalThoughts": 3,
  "isRevision": true,
  "revisesThought": 1
}

// With branching
{
  "thought": "Alternative approach: what if we consider...",
  "nextThoughtNeeded": true,
  "thoughtNumber": 2,
  "totalThoughts": 4,
  "branchFromThought": 1,
  "branchId": "alt-path-1"
}
```

## Tool Parameters

### Required
- `thought` (string): The thought content to process
- `nextThoughtNeeded` (boolean): Whether another thought is needed to continue
- `thoughtNumber` (integer): Current thought number in the sequence
- `totalThoughts` (integer): Total expected thoughts (adjustable)

### Optional
- `isRevision` (boolean): Whether this revises a previous thought
- `revisesThought` (integer): The thought number being revised
- `branchFromThought` (integer): Thought number to branch from
- `branchId` (string): Unique identifier for this branch
- `needsMoreThoughts` (boolean): Extend beyond totalThoughts if needed

## Response Format

```json
{
  "thought_number": 1,
  "total_thoughts": 3,
  "metrics": {
    "complexity": 0.342,
    "depth": 0.521,
    "quality": 0.643,
    "impact": 0.289,
    "confidence": 0.758
  },
  "analytics": {
    "total_thoughts": 5,
    "average_quality": 0.612,
    "chain_effectiveness": 0.145
  },
  "next_thought_needed": true,
  "visual_output": "┌─ 💭 Thought 1/3 ─────────────────┐\\n│ Analysis shows clear patterns... │\\n├─ Metrics ──────────────────────┤\\n│ Quality: 0.64 | Impact: 0.29... │\\n└─────────────────────────────────┘"
}
```

## Troubleshooting

### If Installation Fails
The installation process includes automatic permission fixes. If you encounter issues:

1. **Ensure you have Node.js and npm installed**
2. **Try the alternative installation method:**
   ```bash
   npm install -g git+https://github.com/stat-guy/retrieval-augmented-thinking.git
   ```
3. **For rare permission issues:**
   ```bash
   chmod +x $(npm bin -g)/mcp-server-rat-node
   ```

### Verification Steps
Before configuring Claude Desktop, always verify:
```bash
npx mcp-server-rat-node --help
```

If this shows "RAT MCP Server (Node.js) running on stdio", you're ready to configure Claude Desktop.

## Testing

Run the test suite:
```bash
npm test
```

Test tool execution:
```bash
node test-tool.js
```

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.