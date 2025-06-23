# RAT (Retrieval Augmented Thinking) MCP Tool

## Tool Name
`rat`

## Description
A context-aware reasoning system that orchestrates structured thought processes through dynamic trajectories. Implements iterative hypothesis generation and validation cycles while preserving context coherence across non-linear reasoning paths.

## Installation
```bash
npm install -g /Users/folder location/rat-mcp/node-version
```

## Claude Desktop Configuration
Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "rat": {
      "command": "mcp-server-rat-node"
    }
  }
}
```

## Parameters

### Required Parameters
- **`thought`** (string): Structured reasoning step content
  - Primary analysis chains
  - Hypothesis formulation/validation
  - Branch exploration paths
  - Revision proposals
  - Context preservation markers
  - Verification checkpoints

- **`nextThoughtNeeded`** (boolean): Signal for continuation of reasoning chain
  - `true`: Continue to next thought
  - `false`: Complete current reasoning trajectory

- **`thoughtNumber`** (integer, min: 1): Position in current reasoning trajectory
  - Sequential numbering starting from 1
  - Must be ≤ `totalThoughts` unless `needsMoreThoughts` is true

- **`totalThoughts`** (integer, min: 1): Dynamic scope indicator (adjustable)
  - Initial estimation of reasoning steps needed
  - Can be expanded via `needsMoreThoughts`

### Optional Parameters
- **`isRevision`** (boolean, default: false): Marks recursive refinement steps
- **`revisesThought`** (integer): References target thought number for refinement
- **`branchFromThought`** (integer): Indicates parallel exploration paths source
- **`branchId`** (string): Context identifier for parallel reasoning chains
- **`needsMoreThoughts`** (boolean, default: false): Signals scope expansion requirement

## Response Structure
```typescript
{
  thought_number: number,
  total_thoughts: number,
  metrics: {
    complexity: number,    // 0.0-1.0: Structural complexity score
    depth: number,         // 0.0-1.0: Content depth analysis
    quality: number,       // 0.0-1.0: Overall thought quality
    impact: number,        // 0.0-1.0: Reasoning impact score
    confidence: number     // 0.0-1.0: Certainty assessment
  },
  analytics: {
    total_thoughts: number,
    average_quality: number,
    chain_effectiveness: number
  },
  next_thought_needed: boolean,
  visual_output: string    // Formatted display with metrics
}
```

## Usage Patterns

### Sequential Analysis
```json
{
  "thought": "First, I need to establish the core problem parameters.",
  "nextThoughtNeeded": true,
  "thoughtNumber": 1,
  "totalThoughts": 5
}
```

### Hypothesis Validation
```json
{
  "thought": "Testing hypothesis: The root cause is data inconsistency.",
  "nextThoughtNeeded": true,
  "thoughtNumber": 3,
  "totalThoughts": 5
}
```

### Revision with Refinement
```json
{
  "thought": "Upon further analysis, the initial assumption was incomplete...",
  "nextThoughtNeeded": true,
  "thoughtNumber": 4,
  "totalThoughts": 5,
  "isRevision": true,
  "revisesThought": 2
}
```

### Branch Exploration
```json
{
  "thought": "Alternative approach: Consider the performance implications...",
  "nextThoughtNeeded": true,
  "thoughtNumber": 3,
  "totalThoughts": 4,
  "branchFromThought": 2,
  "branchId": "performance_analysis"
}
```

### Scope Extension
```json
{
  "thought": "This requires deeper investigation beyond initial scope.",
  "nextThoughtNeeded": true,
  "thoughtNumber": 5,
  "totalThoughts": 5,
  "needsMoreThoughts": true
}
```

## Execution Protocol
1. **Initialize** with scope estimation (`totalThoughts`)
2. **Generate** structured reasoning steps sequentially
3. **Validate** hypotheses through verification cycles
4. **Maintain** context coherence across branches
5. **Implement** revisions through recursive refinement
6. **Signal** completion when validation succeeds

## Best Practices for AI Assistants
- Start with realistic `totalThoughts` estimate (3-7 for most problems)
- Use `isRevision` when refining earlier thoughts
- Create branches for parallel analysis paths
- Extend scope with `needsMoreThoughts` when complexity emerges
- Always provide substantive `thought` content
- Set `nextThoughtNeeded: false` only when reasoning is complete

## Error Prevention
- Ensure `thought` content is non-empty and meaningful
- Keep `thoughtNumber` ≤ `totalThoughts` unless extending scope
- When using `isRevision: true`, always specify `revisesThought`
- When branching, provide both `branchFromThought` and `branchId`
- Use descriptive, analytical language in thought content