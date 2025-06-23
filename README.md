# Retrieval Augmented Thinking (RAT) MCP Server

A powerful MCP server that enables AI assistants to perform structured reasoning through dynamic thought processes. The RAT server provides sophisticated thought processing capabilities with metrics, branching, revision, and context preservation across non-linear reasoning paths.

## Features

- **Structured Thought Processing**: Orchestrates complex reasoning chains with sequential analysis
- **Dynamic Branching**: Supports parallel exploration through managed branch contexts  
- **Iterative Refinement**: Enables recursive revision cycles for thought improvement
- **Hypothesis Validation**: Implements multi-step verification checkpoints
- **Context Coherence**: Maintains reasoning context across non-linear exploration paths
- **Real-time Metrics**: Provides complexity, depth, quality, impact, and confidence scores
- **Visual Feedback**: Rich formatted output with progress indicators and analytics

## Installation

Install the RAT MCP server via npm:

```bash
npm install -g mcp-server-rat-node
```

## Configuration

### Claude Desktop

Add the RAT server to your Claude Desktop configuration:

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

### Other MCP Clients

For other MCP-compatible clients, use:

```bash
mcp-server-rat-node
```

## Tool Overview

The RAT server exposes a single powerful tool called `rat` that processes structured thoughts with advanced reasoning capabilities.

### Core Parameters

#### Required
- **`thought`** (string): The reasoning step content to process
- **`nextThoughtNeeded`** (boolean): Whether continuation is needed
- **`thoughtNumber`** (integer): Current position in reasoning chain
- **`totalThoughts`** (integer): Estimated total thoughts needed

#### Optional
- **`isRevision`** (boolean): Marks recursive refinement steps
- **`revisesThought`** (integer): Target thought number for revision
- **`branchFromThought`** (integer): Source thought for parallel exploration
- **`branchId`** (string): Unique identifier for branch context
- **`needsMoreThoughts`** (boolean): Signals scope expansion requirement

## Usage Examples

### Sequential Analysis
```javascript
{
  "thought": "First, I need to identify the core problem parameters and constraints.",
  "nextThoughtNeeded": true,
  "thoughtNumber": 1,
  "totalThoughts": 4
}
```

### Hypothesis Validation
```javascript
{
  "thought": "Testing hypothesis: The performance bottleneck is in the database query optimization.",
  "nextThoughtNeeded": true,
  "thoughtNumber": 2,
  "totalThoughts": 4
}
```

### Thought Revision
```javascript
{
  "thought": "On deeper analysis, the initial assumption about the bottleneck location was incomplete...",
  "nextThoughtNeeded": true,
  "thoughtNumber": 3,
  "totalThoughts": 4,
  "isRevision": true,
  "revisesThought": 2
}
```

### Branch Exploration
```javascript
{
  "thought": "Alternative approach: What if we consider caching as the primary solution?",
  "nextThoughtNeeded": true,
  "thoughtNumber": 3,
  "totalThoughts": 5,
  "branchFromThought": 2,
  "branchId": "caching_solution"
}
```

### Scope Extension
```javascript
{
  "thought": "This problem requires deeper investigation beyond the initial scope.",
  "nextThoughtNeeded": true,
  "thoughtNumber": 4,
  "totalThoughts": 4,
  "needsMoreThoughts": true
}
```

## Response Format

The RAT tool returns comprehensive analysis with metrics and visual feedback:

```json
{
  "thought_number": 2,
  "total_thoughts": 4,
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
  "visual_output": "┌─ 💭 Thought 2/4 ─────────────────┐\n│ Testing hypothesis: Performance... │\n├─ Metrics ──────────────────────┤\n│ Quality: 0.64 | Impact: 0.29   │\n│ Depth: 0.52 | Confidence: 0.76 │\n└─────────────────────────────────┘"
}
```

### Metrics Explanation

- **Complexity** (0.0-1.0): Structural complexity of the thought process
- **Depth** (0.0-1.0): Analytical depth and thoroughness
- **Quality** (0.0-1.0): Overall thought quality assessment
- **Impact** (0.0-1.0): Potential impact on problem resolution
- **Confidence** (0.0-1.0): Certainty level of the reasoning

## Reasoning Patterns

### 1. Sequential Analysis with Backtracking
Process thoughts in order with ability to revisit and refine earlier steps.

### 2. Parallel Exploration 
Create branches to explore multiple solution paths simultaneously.

### 3. Recursive Refinement
Continuously improve thoughts through structured revision cycles.

### 4. Hypothesis Validation
Test assumptions through multi-step verification processes.

## Best Practices

1. **Start with realistic scope**: Estimate 3-7 thoughts for most problems
2. **Use meaningful content**: Provide substantive reasoning in each thought
3. **Leverage revisions**: Refine earlier thoughts when new insights emerge
4. **Branch strategically**: Create parallel paths for complex problems
5. **Extend scope wisely**: Use `needsMoreThoughts` when complexity increases
6. **Complete properly**: Set `nextThoughtNeeded: false` only when done

## Development

### Testing

Run the test suite:

```bash
npm test
```

Test tool execution directly:

```bash
node test-tool.js
```

### Local Development

Clone and install dependencies:

```bash
git clone https://github.com/stat-guy/retrieval-augmented-thinking.git
cd retrieval-augmented-thinking
npm install
```

Run the server locally:

```bash
node index.js
```

## Use Cases

- **Complex Problem Solving**: Break down multi-faceted problems systematically
- **Code Analysis**: Analyze codebases with structured reasoning
- **System Design**: Explore architectural decisions through branching analysis  
- **Research Planning**: Structure research approaches with validation cycles
- **Decision Making**: Evaluate options through parallel exploration paths
- **Debugging**: Systematically isolate and resolve technical issues

## Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## License

MIT License - see LICENSE file for details.

## Support

For issues, questions, or feature requests, please use the GitHub Issues tab.