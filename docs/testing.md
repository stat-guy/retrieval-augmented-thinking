# Testing Guide

This document provides information about testing the Retrieval-Augmented Thinking MCP Server.

## Testing Environment

The server can be tested using any MCP-compatible client. Here are some recommended testing environments:

1. Direct stdio testing:
```bash
mcp-server-retrieval-augmented-thinking
```

2. Using Claude Desktop Client:
- Add server to Claude configuration
- Test through the chat interface

## Test Cases

### 1. Basic Thought Chain

Test a simple linear thought chain:

```json
{
  "thought": "Initial analysis of the problem",
  "thoughtNumber": 1,
  "totalThoughts": 3,
  "nextThoughtNeeded": true
}
```

Expected:
- Server accepts input
- Returns proper metrics
- Updates analytics
- Shows formatted output

### 2. Branching Thoughts

Test thought branching:

```json
{
  "thought": "Alternative approach consideration",
  "thoughtNumber": 2,
  "totalThoughts": 4,
  "nextThoughtNeeded": true,
  "branchFromThought": 1,
  "branchId": "alternative-1"
}
```

Verify:
- Branch creation
- Proper context preservation
- Branch metrics calculation

### 3. Revisions

Test revision capabilities:

```json
{
  "thought": "Refined analysis based on new information",
  "thoughtNumber": 2,
  "totalThoughts": 3,
  "nextThoughtNeeded": true,
  "isRevision": true,
  "revisesThought": 1
}
```

Check:
- Revision tracking
- Impact metrics
- Analytics updates

### 4. Error Handling

Test error cases:

1. Missing required fields
2. Invalid data types
3. Out-of-range values
4. Malformed input

### 5. Analytics

Verify analytics calculations:

1. Chain effectiveness
2. Revision impact
3. Branch success rate
4. Overall quality

## Integration Testing

Test integration with:

1. Claude Desktop
2. Cursor.ai
3. Other MCP-compatible clients

## Performance Testing

Monitor:

1. Response times
2. Memory usage
3. Long thought chain handling
4. Multiple branch management

## Reporting Issues

When reporting issues, include:

1. Input data
2. Expected behavior
3. Actual behavior
4. Error messages
5. Server logs