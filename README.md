# RAT MCP Server (Node.js)

Retrieval Augmented Thinking MCP Server - A reasoning tool that processes structured thoughts with metrics, branching, and revision capabilities.

## Installation

```bash
npm install mcp-server-rat-node
```

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
  "visual_output": "┌─ 💭 Thought 1/3 ─────────────────┐\n│ Analysis shows clear patterns... │\n├─ Metrics ──────────────────────┤\n│ Quality: 0.64 | Impact: 0.29... │\n└─────────────────────────────────┘"
}
```

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

MIT
