# RAT (Retrieval Augmented Thinking) MCP Tool - AI Assistant Guide

## Tool Overview

The RAT tool is a context-aware reasoning system that orchestrates structured thought processes through dynamic trajectories. It implements iterative hypothesis generation and validation cycles while preserving context coherence across non-linear reasoning paths.

## Tool Name
`rat`

## Installation for AI Assistants

AI assistants need the RAT MCP server configured in their MCP client. For Claude Desktop:

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

## Core Capabilities

### Reasoning Patterns
- **Sequential Analysis**: Step-by-step reasoning with backtracking capability
- **Parallel Exploration**: Managed branch contexts for exploring multiple paths
- **Recursive Refinement**: Structured revision cycles for thought improvement
- **Hypothesis Validation**: Multi-step verification through checkpoints
- **Dynamic Scope**: Adjustable reasoning trajectories with extension capability

### Thought Processing Features
- Primary analysis chains
- Hypothesis formulation and validation
- Branch exploration paths
- Revision proposals with targeted refinement
- Context preservation markers
- Verification checkpoints

## Parameters

### Required Parameters

#### `thought` (string)
The structured reasoning step content to process. Should contain:
- Substantive analytical content
- Clear reasoning progression
- Specific insights or hypotheses
- Contextual connections to previous thoughts

#### `nextThoughtNeeded` (boolean)
Signal for continuation of reasoning chain:
- `true`: Continue to next thought in sequence
- `false`: Complete current reasoning trajectory

#### `thoughtNumber` (integer, minimum: 1)
Position in current reasoning trajectory:
- Sequential numbering starting from 1
- Must be ≤ `totalThoughts` unless extending scope
- Used to track reasoning progression

#### `totalThoughts` (integer, minimum: 1)
Dynamic scope indicator (adjustable):
- Initial estimation of reasoning steps needed
- Can be expanded via `needsMoreThoughts` parameter
- Helps structure the reasoning process

### Optional Parameters

#### `isRevision` (boolean, default: false)
Marks recursive refinement steps:
- Use when refining or correcting earlier thoughts
- Requires `revisesThought` parameter when true
- Enables iterative improvement of reasoning

#### `revisesThought` (integer)
References target thought number for refinement:
- Must specify which thought is being revised
- Required when `isRevision` is true
- Maintains revision history and context

#### `branchFromThought` (integer)
Indicates parallel exploration paths source:
- Specifies which thought to branch from
- Enables parallel reasoning exploration
- Requires `branchId` for context management

#### `branchId` (string)
Context identifier for parallel reasoning chains:
- Unique identifier for branch tracking
- Required when `branchFromThought` is specified
- Helps maintain branch coherence

#### `needsMoreThoughts` (boolean, default: false)
Signals scope expansion requirement:
- Use when reasoning requires more steps than initially estimated
- Allows extending beyond `totalThoughts` limit
- Enables dynamic scope adjustment

## Response Structure

```typescript
{
  thought_number: number,           // Current thought position
  total_thoughts: number,           // Total thoughts in sequence
  metrics: {
    complexity: number,             // 0.0-1.0: Structural complexity score
    depth: number,                  // 0.0-1.0: Content depth analysis
    quality: number,                // 0.0-1.0: Overall thought quality
    impact: number,                 // 0.0-1.0: Reasoning impact score
    confidence: number              // 0.0-1.0: Certainty assessment
  },
  analytics: {
    total_thoughts: number,         // Chain length statistics
    average_quality: number,        // Mean quality across chain
    chain_effectiveness: number     // Overall chain performance
  },
  next_thought_needed: boolean,     // Continuation signal
  visual_output: string            // Formatted display with metrics
}
```

## Usage Patterns for AI Assistants

### 1. Sequential Problem Analysis

Start with problem identification and work through systematic analysis:

```json
{
  "thought": "First, I need to identify the core problem: the user is experiencing slow API response times during peak hours.",
  "nextThoughtNeeded": true,
  "thoughtNumber": 1,
  "totalThoughts": 5
}
```

### 2. Hypothesis Formation and Testing

Develop and test specific hypotheses:

```json
{
  "thought": "Hypothesis: The bottleneck is in the database connection pooling. The evidence suggests connection timeout errors correlate with peak usage.",
  "nextThoughtNeeded": true,
  "thoughtNumber": 3,
  "totalThoughts": 5
}
```

### 3. Thought Revision with New Insights

Refine earlier thoughts when new information emerges:

```json
{
  "thought": "Upon reviewing the logs more carefully, my initial hypothesis about database connections was incomplete. The actual issue appears to be memory leaks in the caching layer.",
  "nextThoughtNeeded": true,
  "thoughtNumber": 4,
  "totalThoughts": 5,
  "isRevision": true,
  "revisesThought": 3
}
```

### 4. Parallel Exploration

Explore alternative approaches simultaneously:

```json
{
  "thought": "Alternative solution path: Instead of fixing the caching layer, we could implement a CDN-based solution to reduce server load entirely.",
  "nextThoughtNeeded": true,
  "thoughtNumber": 4,
  "totalThoughts": 6,
  "branchFromThought": 3,
  "branchId": "cdn_solution"
}
```

### 5. Dynamic Scope Extension

Extend reasoning when complexity exceeds initial estimation:

```json
{
  "thought": "The problem is more complex than initially assessed. We need to consider the interaction between the caching layer, database, and CDN holistically.",
  "nextThoughtNeeded": true,
  "thoughtNumber": 5,
  "totalThoughts": 5,
  "needsMoreThoughts": true
}
```

## Execution Protocol for AI Assistants

### Phase 1: Initialize
1. Estimate initial scope with realistic `totalThoughts` (typically 3-7)
2. Begin with clear problem statement or analysis goal
3. Set up reasoning trajectory structure

### Phase 2: Generate
1. Create structured reasoning steps sequentially
2. Maintain substantive content in each thought
3. Progress logically through analysis stages

### Phase 3: Validate
1. Test hypotheses through verification cycles
2. Use revision to refine incorrect or incomplete thoughts
3. Maintain reasoning quality and coherence

### Phase 4: Branch (if needed)
1. Create parallel exploration paths for complex problems
2. Use descriptive `branchId` values for context
3. Maintain branch coherence and purpose

### Phase 5: Refine
1. Implement revisions through recursive refinement
2. Reference specific thoughts being revised
3. Improve reasoning quality iteratively

### Phase 6: Complete
1. Signal completion only when reasoning is truly finished
2. Ensure all hypotheses are validated or revised
3. Provide comprehensive final analysis

## Best Practices for AI Assistants

### Content Quality
- **Substantive Thoughts**: Each thought should contain meaningful analysis, not just placeholders
- **Clear Progression**: Show logical flow from one thought to the next
- **Specific Insights**: Include concrete observations, hypotheses, or conclusions
- **Contextual Awareness**: Reference and build upon previous thoughts

### Scope Management
- **Realistic Estimation**: Start with 3-7 thoughts for most problems
- **Flexible Adjustment**: Use `needsMoreThoughts` when complexity emerges
- **Proper Completion**: Only set `nextThoughtNeeded: false` when truly finished

### Revision Strategy
- **Targeted Refinement**: Use `isRevision` to improve specific earlier thoughts
- **Clear References**: Always specify `revisesThought` when revising
- **Meaningful Improvements**: Ensure revisions add value, not just restate

### Branching Strategy
- **Strategic Branching**: Create branches for genuinely different approaches
- **Descriptive IDs**: Use clear, descriptive `branchId` values
- **Purposeful Exploration**: Each branch should explore distinct solution paths

### Error Prevention
- **Non-empty Content**: Always provide meaningful `thought` content
- **Parameter Consistency**: Ensure `thoughtNumber` ≤ `totalThoughts` unless extending
- **Revision Requirements**: When `isRevision: true`, always include `revisesThought`
- **Branch Requirements**: When branching, provide both `branchFromThought` and `branchId`

## Example: Complete Problem-Solving Session

```json
// Thought 1: Problem identification
{
  "thought": "The user reports their web application is experiencing intermittent 500 errors during peak traffic periods. I need to systematically analyze the potential causes.",
  "nextThoughtNeeded": true,
  "thoughtNumber": 1,
  "totalThoughts": 4
}

// Thought 2: Initial hypothesis
{
  "thought": "Primary hypothesis: Server resource exhaustion during peak load. The timing correlation suggests CPU or memory limits are being exceeded.",
  "nextThoughtNeeded": true,
  "thoughtNumber": 2,
  "totalThoughts": 4
}

// Thought 3: Evidence analysis
{
  "thought": "Analyzing the error patterns: 500 errors spike at 2PM and 8PM daily, correlating with user activity peaks. Server metrics show CPU usage at 95% during these periods.",
  "nextThoughtNeeded": true,
  "thoughtNumber": 3,
  "totalThoughts": 4
}

// Thought 4: Revision with new insights
{
  "thought": "Correction to my earlier hypothesis: While CPU usage is high, the actual issue is memory leaks in the session management system causing garbage collection pauses and timeouts.",
  "nextThoughtNeeded": false,
  "thoughtNumber": 4,
  "totalThoughts": 4,
  "isRevision": true,
  "revisesThought": 2
}
```

## Metrics Interpretation

### Quality Metrics (0.0-1.0 scale)
- **Complexity**: Higher values indicate more sophisticated reasoning structures
- **Depth**: Higher values show thorough analysis and comprehensive coverage
- **Quality**: Overall assessment of thought effectiveness and clarity
- **Impact**: Potential influence on problem resolution or understanding
- **Confidence**: Certainty level in the reasoning and conclusions

### Analytics
- **Total Thoughts**: Complete chain length including branches and revisions
- **Average Quality**: Mean quality score across the entire reasoning chain
- **Chain Effectiveness**: Overall performance metric for the reasoning process

Use these metrics to assess reasoning quality and adjust approach accordingly.