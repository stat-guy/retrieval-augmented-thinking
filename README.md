# MCP Retrieval Augmented Thinking Server

A Node.js MCP (Model Context Protocol) server implementing Chain of Draft (CoD) reasoning for enhanced problem-solving capabilities.

## Features

- **Chain of Draft Reasoning**: Iterative draft-based problem solving approach
- **Domain-Specific Optimization**: Specialized solving for math, logic, code, and general problems
- **Complexity Analysis**: Automatic problem complexity assessment and adaptive parameter tuning
- **Performance Analytics**: Built-in tracking and comparison of CoD vs CoT approaches
- **Token Optimization**: Reduced token usage while maintaining solution quality

## Quick Start

### Installation

```bash
git clone https://github.com/stat-guy/retrieval-augmented-thinking.git
cd retrieval-augmented-thinking
npm install
```

### Setup

1. Set your OpenAI API key:
```bash
export OPENAI_API_KEY="your-openai-api-key"
```

2. Configure in Claude Desktop (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "chain-of-draft": {
      "command": "node",
      "args": ["/path/to/retrieval-augmented-thinking/index.js"]
    }
  }
}
```

### Usage

Once configured, you can use the server through Claude Desktop or any MCP-compatible client:

```javascript
// Basic problem solving
{
  "problem": "If a train travels 60 mph for 2 hours, how far does it go?",
  "domain": "math"
}

// Complex coding problem
{
  "problem": "Design an algorithm to find the shortest path in a weighted graph",
  "domain": "code",
  "approach": "CoD",
  "max_words_per_step": 120
}
```

## Available Tools

### Core Reasoning Tools
- `chain_of_draft_solve` - Context-aware reasoning with adaptive trajectories
- `math_solve` - Specialized mathematical problem solver
- `code_solve` - Algorithm and coding challenge solver
- `logic_solve` - Deductive and inductive reasoning solver

### Analysis Tools
- `analyze_problem_complexity` - Comprehensive complexity analysis
- `get_performance_stats` - Performance comparison statistics
- `get_token_reduction` - Token efficiency analysis

## Chain of Draft vs Chain of Thought

**Chain of Draft (CoD)** improves upon traditional Chain of Thought reasoning by:

- Creating multiple draft solutions before final answer
- Iterative refinement through comparison and analysis
- Better handling of complex, multi-faceted problems
- Reduced token usage through focused reasoning steps
- Adaptive complexity management

## Architecture

```
├── index.js                 # Main MCP server
├── lib/
│   ├── chain-of-draft-client.js  # Core reasoning logic
│   ├── analytics-db.js           # Performance tracking
│   └── complexity-estimator.js   # Problem analysis
├── CLAUDE.md                # Detailed documentation
└── package.json             # Dependencies
```

## Development

### Running Tests

```bash
npm test
```

### Local Development

```bash
node index.js
```

## Performance Benefits

- **20-40% token reduction** compared to traditional Chain of Thought
- **Improved solution quality** through iterative drafting
- **Better complex problem handling** with adaptive approaches
- **Domain-specific optimizations** for math, code, and logic problems

## Contributing

Contributions are welcome! Please read the contributing guidelines and submit pull requests for any improvements.

## License

MIT License - see LICENSE file for details.

## Related Projects

- [Model Context Protocol](https://github.com/modelcontextprotocol)
- [Claude Desktop](https://claude.ai/)
- [MCP Servers](https://github.com/modelcontextprotocol/servers)

---

🤖 Enhanced reasoning for AI systems through structured thought processes and iterative refinement.