# Usage Guide

This guide explains how to use the Retrieval-Augmented Thinking MCP Server with various MCP-compatible clients.

## Installation

```bash
npm install @modelcontextprotocol/server-retrieval-augmented-thinking
```

## Running the Server

The server can be started directly using:

```bash
mcp-server-retrieval-augmented-thinking
```

## Client Configuration

### Claude Desktop

1. Open Claude Desktop settings
2. Navigate to the MCP Servers section
3. Add new server with the following configuration:
   ```json
   {
     "name": "Retrieval-Augmented Thinking",
     "command": "mcp-server-retrieval-augmented-thinking",
     "type": "command"
   }
   ```

### Cursor.ai

1. Open settings in Cursor
2. Add new MCP server
3. Use the following configuration:
   ```json
   {
     "name": "rat",
     "command": "mcp-server-retrieval-augmented-thinking"
   }
   ```

## Using the Tool

The server provides a tool named "rat" that can be used to generate and manage structured thought processes.

### Input Format

The tool accepts input in the following format:

```json
{
  "thought": "Your current thinking step",
  "thoughtNumber": 1,
  "totalThoughts": 3,
  "nextThoughtNeeded": true,
  "isRevision": false,
  "revisesThought": null,
  "branchFromThought": null,
  "branchId": null,
  "needsMoreThoughts": false
}
```

### Required Fields

- `thought`: String containing the current thought
- `thoughtNumber`: Current position in the thought chain
- `totalThoughts`: Estimated total thoughts needed
- `nextThoughtNeeded`: Whether another thought is needed

### Optional Fields

- `isRevision`: Whether this revises a previous thought
- `revisesThought`: Number of thought being revised
- `branchFromThought`: Starting point for a new thought branch
- `branchId`: Identifier for the branch
- `needsMoreThoughts`: Signal for scope expansion

### Response Format

The tool returns responses in the following format:

```json
{
  "thought_number": 1,
  "total_thoughts": 3,
  "metrics": {
    "complexity": 0.4,
    "depth": 0.6,
    "quality": 0.6,
    "impact": 0.5,
    "confidence": 0.7
  },
  "analytics": {
    "total_thoughts": 1,
    "average_quality": 0.6,
    "chain_effectiveness": 0.6
  },
  "next_thought_needed": true,
  "visual_output": "formatted display"
}
```

## Features

### Thought Chain Management

The server maintains a coherent chain of thoughts, allowing for:
- Sequential development of ideas
- Branching for alternative approaches
- Revisions of previous thoughts
- Quality metrics tracking

### Metrics and Analytics

The server tracks various metrics:
- Thought complexity
- Reasoning depth
- Quality assessment
- Overall impact
- Chain effectiveness
- Branch success rates

### Visual Formatting

Thoughts are displayed with visual formatting:
- Main thoughts: 💭 
- Revisions: 💭 (Revision)
- Branches: 🌿 (Branch)

## Best Practices

1. Start with clear initial thoughts
2. Use revisions when refining ideas
3. Create branches for alternative approaches
4. Monitor metrics for thought quality
5. Use detailed thoughts for better depth scores
6. Include reasoning keywords for higher impact

## Troubleshooting

Common issues and solutions:

1. **Server Not Starting**
   - Check Node.js version (>=18.0.0 required)
   - Verify installation path
   - Check execution permissions

2. **Input Validation Errors**
   - Ensure required fields are present
   - Check data types
   - Verify thought numbers are sequential

3. **Metric Issues**
   - Use more detailed thoughts
   - Include reasoning keywords
   - Add proper thought structure