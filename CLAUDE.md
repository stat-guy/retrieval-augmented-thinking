# Chain of Draft MCP Server

## Overview
A context-aware reasoning system that orchestrates structured thought processes through dynamic trajectories. This MCP server implements Chain of Draft (CoD) reasoning as an alternative to Chain of Thought (CoT) for improved problem-solving efficiency.

## Core Capabilities
- **Maintains adaptive thought chains** with branching and revision capabilities
- **Implements iterative hypothesis generation** and validation cycles  
- **Preserves context coherence** across non-linear reasoning paths
- **Supports dynamic scope adjustment** and trajectory refinement

## Reasoning Patterns
- **Sequential analysis** with backtracking capability
- **Parallel exploration** through managed branch contexts
- **Recursive refinement** via structured revision cycles
- **Hypothesis validation** through multi-step verification

## Available Tools

### chain_of_draft_solve
A context-aware reasoning system that orchestrates structured thought processes through dynamic trajectories. 

**Parameters:**
- `problem` (required): Structured reasoning step that supports primary analysis chains, hypothesis formulation/validation, branch exploration paths, revision proposals, context preservation markers, and verification checkpoints
- `domain`: Domain for context (math, logic, code, common-sense, etc.) - defaults to 'general'
- `max_words_per_step`: Maximum words per reasoning step - Dynamic scope indicator (adjustable)
- `approach`: Force 'CoD' or 'CoT' approach - Marks recursive refinement steps
- `enforce_format`: Whether to enforce the word limit - Signal for continuation of reasoning chain
- `adaptive_word_limit`: Adjust word limits based on complexity - Signals scope expansion requirement

### math_solve
Specialized math problem solver using Chain of Draft reasoning with domain-specific optimizations.

### code_solve  
Coding problem solver with Chain of Draft reasoning for algorithm and implementation challenges.

### logic_solve
Logic problem solver optimized for deductive and inductive reasoning tasks.

### get_performance_stats
Retrieve performance comparison statistics between CoD and CoT approaches across different domains.

### get_token_reduction
Analyze token reduction statistics showing efficiency gains of CoD vs CoT approaches.

### analyze_problem_complexity
Comprehensive problem complexity analysis with domain-specific indicators and recommended parameters.

## Execution Protocol
1. **Initialize** with scope estimation
2. **Generate** structured reasoning steps  
3. **Validate** hypotheses through verification cycles
4. **Maintain** context coherence across branches
5. **Implement** revisions through recursive refinement
6. **Signal** completion on validation success

## Performance Benefits
- Reduced token usage compared to traditional Chain of Thought
- Improved reasoning quality through iterative drafting
- Better handling of complex, multi-faceted problems
- Adaptive complexity management based on problem analysis

## Usage Examples

### Basic Problem Solving
```javascript
// Simple problem
{
  "problem": "If a train travels 60 mph for 2 hours, how far does it go?",
  "domain": "math"
}

// Complex problem with custom parameters
{
  "problem": "Design an algorithm to find the shortest path in a weighted graph",
  "domain": "code", 
  "max_words_per_step": 120,
  "approach": "CoD",
  "adaptive_word_limit": true
}
```

### Performance Analysis
```javascript
// Get domain-specific stats
{
  "domain": "math"
}

// Analyze complexity before solving
{
  "problem": "Prove that the square root of 2 is irrational",
  "domain": "math"
}
```

## Installation & Setup

1. Install dependencies:
```bash
npm install @modelcontextprotocol/sdk openai axios dotenv
```

2. Set environment variables:
```bash
export OPENAI_API_KEY="your-openai-api-key"
```

3. Run the server:
```bash
node index.js
```

4. Configure in Claude Desktop `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "chain-of-draft": {
      "command": "node",
      "args": ["/path/to/index.js"]
    }
  }
}
```