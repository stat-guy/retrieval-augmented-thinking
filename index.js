const { StdioServerTransport } = require('@modelcontextprotocol/sdk/dist/transport/stdio');
const { Server, ListToolsRequestSchema, CallToolRequestSchema } = require('@modelcontextprotocol/sdk/dist/server');
const chainOfDraftClient = require('./lib/chain-of-draft-client');
const analyticsDb = require('./lib/analytics-db');
const complexityEstimator = require('./lib/complexity-estimator');

// Create server instance
const server = new Server({
  name: 'chain-of-draft-mcp-server',
  version: '1.0.0',
  description: 'Chain of Draft reasoning MCP server',
  tools: {},
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    // Chain of Draft solve
    if (name === "chain_of_draft_solve") {
      const result = await chainOfDraftClient.solveWithReasoning(args);
      
      const formattedResponse = 
        `Chain of ${result.approach} reasoning (${result.word_limit} word limit):\n\n` +
        `${result.reasoning_steps}\n\n` +
        `Final answer: ${result.final_answer}\n\n` +
        `Stats: ${result.token_count} tokens, ${result.execution_time_ms.toFixed(0)}ms, ` +
        `complexity score: ${result.complexity}`;
      
      return {
        content: [{
          type: "text",
          text: formattedResponse
        }]
      };
    }

    // Math solver
    if (name === "math_solve") {
      const result = await chainOfDraftClient.solveWithReasoning({
        ...args,
        domain: "math"
      });
      
      const formattedResponse = 
        `Chain of ${result.approach} reasoning (${result.word_limit} word limit):\n\n` +
        `${result.reasoning_steps}\n\n` +
        `Final answer: ${result.final_answer}\n\n` +
        `Stats: ${result.token_count} tokens, ${result.execution_time_ms.toFixed(0)}ms, ` +
        `complexity score: ${result.complexity}`;
      
      return {
        content: [{
          type: "text",
          text: formattedResponse
        }]
      };
    }

    // Code solver
    if (name === "code_solve") {
      const result = await chainOfDraftClient.solveWithReasoning({
        ...args,
        domain: "code"
      });
      
      const formattedResponse = 
        `Chain of ${result.approach} reasoning (${result.word_limit} word limit):\n\n` +
        `${result.reasoning_steps}\n\n` +
        `Final answer: ${result.final_answer}\n\n` +
        `Stats: ${result.token_count} tokens, ${result.execution_time_ms.toFixed(0)}ms, ` +
        `complexity score: ${result.complexity}`;
      
      return {
        content: [{
          type: "text",
          text: formattedResponse
        }]
      };
    }

    // Logic solver
    if (name === "logic_solve") {
      const result = await chainOfDraftClient.solveWithReasoning({
        ...args,
        domain: "logic"
      });
      
      const formattedResponse = 
        `Chain of ${result.approach} reasoning (${result.word_limit} word limit):\n\n` +
        `${result.reasoning_steps}\n\n` +
        `Final answer: ${result.final_answer}\n\n` +
        `Stats: ${result.token_count} tokens, ${result.execution_time_ms.toFixed(0)}ms, ` +
        `complexity score: ${result.complexity}`;
      
      return {
        content: [{
          type: "text",
          text: formattedResponse
        }]
      };
    }

    // Performance stats
    if (name === "get_performance_stats") {
      const stats = analyticsDb.getPerformanceByDomain(args.domain);
      
      let result = "Performance Comparison (CoD vs CoT):\n\n";
      
      if (!stats || stats.length === 0) {
        result = "No performance data available yet.";
      } else {
        for (const stat of stats) {
          result += `Domain: ${stat.domain}\n`;
          result += `Approach: ${stat.approach}\n`;
          result += `Average tokens: ${stat.avg_tokens.toFixed(1)}\n`;
          result += `Average time: ${stat.avg_time_ms.toFixed(1)}ms\n`;
          
          if (stat.accuracy !== null) {
            result += `Accuracy: ${(stat.accuracy * 100).toFixed(1)}%\n`;
          }
          
          result += `Sample size: ${stat.count}\n\n`;
        }
      }
      
      return {
        content: [{
          type: "text",
          text: result
        }]
      };
    }

    // Token reduction
    if (name === "get_token_reduction") {
      const stats = analyticsDb.getTokenReductionStats();
      
      let result = "Token Reduction Analysis:\n\n";
      
      if (!stats || stats.length === 0) {
        result = "No reduction data available yet.";
      } else {
        for (const stat of stats) {
          result += `Domain: ${stat.domain}\n`;
          result += `CoD avg tokens: ${stat.cod_avg_tokens.toFixed(1)}\n`;
          result += `CoT avg tokens: ${stat.cot_avg_tokens.toFixed(1)}\n`;
          result += `Reduction: ${stat.reduction_percentage.toFixed(1)}%\n`;
          result += `Sample size: ${stat.count}\n\n`;
        }
      }
      
      return {
        content: [{
          type: "text",
          text: result
        }]
      };
    }

    // Complexity analysis
    if (name === "analyze_problem_complexity") {
      const analysis = complexityEstimator.analyzeProblem(args.problem, args.domain || "general");
      
      let result = `Complexity Analysis for ${args.domain || "general"} problem:\n\n`;
      result += `Word count: ${analysis.word_count}\n`;
      result += `Sentence count: ${analysis.sentence_count}\n`;
      result += `Words per sentence: ${analysis.words_per_sentence.toFixed(1)}\n`;
      result += `Complexity indicators found: ${analysis.indicator_count}\n`;
      
      if (analysis.found_indicators && analysis.found_indicators.length > 0) {
        result += `Indicators: ${analysis.found_indicators.join(", ")}\n`;
      }
      
      result += `Question count: ${analysis.question_count}\n`;
      result += `\nEstimated complexity score: ${analysis.estimated_complexity}\n`;
      result += `Recommended word limit per step: ${analysis.estimated_complexity}\n`;
      
      return {
        content: [{
          type: "text",
          text: result
        }]
      };
    }

    // Handle unknown tool
    return {
      content: [{
        type: "text",
        text: `Unknown tool: ${name}`
      }],
      isError: true
    };
  } catch (error) {
    console.error("Error executing tool:", error);
    return {
      content: [{
        type: "text",
        text: `Error executing tool ${name}: ${error.message}`
      }],
      isError: true
    };
  }
});

// Expose available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'chain_of_draft_solve',
      description: 'A context-aware reasoning system that orchestrates structured thought processes through dynamic trajectories. Core Capabilities: Maintains adaptive thought chains with branching and revision capabilities; Implements iterative hypothesis generation and validation cycles; Preserves context coherence across non-linear reasoning paths; Supports dynamic scope adjustment and trajectory refinement. Reasoning Patterns: Sequential analysis with backtracking capability; Parallel exploration through managed branch contexts; Recursive refinement via structured revision cycles; Hypothesis validation through multi-step verification.',
      parameters: {
        type: 'object',
        properties: {
          problem: {
            type: 'string',
            description: 'Structured reasoning step that supports: Primary analysis chains; Hypothesis formulation/validation; Branch exploration paths; Revision proposals; Context preservation markers; Verification checkpoints'
          },
          domain: {
            type: 'string',
            description: 'Domain for context (math, logic, code, common-sense, etc.)',
            default: 'general'
          },
          max_words_per_step: {
            type: 'number',
            description: 'Maximum words per reasoning step - Dynamic scope indicator (adjustable)'
          },
          approach: {
            type: 'string',
            description: "Force 'CoD' or 'CoT' approach - Marks recursive refinement steps"
          },
          enforce_format: {
            type: 'boolean',
            description: 'Whether to enforce the word limit - Signal for continuation of reasoning chain',
            default: true
          },
          adaptive_word_limit: {
            type: 'boolean',
            description: 'Adjust word limits based on complexity - Signals scope expansion requirement',
            default: true
          }
        },
        required: ['problem']
      }
    },
    {
      name: 'math_solve',
      description: 'Solve a math problem using Chain of Draft reasoning',
      parameters: {
        type: 'object',
        properties: {
          problem: {
            type: 'string',
            description: 'The math problem to solve'
          },
          approach: {
            type: 'string',
            description: "Force 'CoD' or 'CoT' approach"
          },
          max_words_per_step: {
            type: 'number',
            description: 'Maximum words per reasoning step'
          }
        },
        required: ['problem']
      }
    },
    {
      name: 'code_solve',
      description: 'Solve a coding problem using Chain of Draft reasoning',
      parameters: {
        type: 'object',
        properties: {
          problem: {
            type: 'string',
            description: 'The coding problem to solve'
          },
          approach: {
            type: 'string',
            description: "Force 'CoD' or 'CoT' approach"
          },
          max_words_per_step: {
            type: 'number',
            description: 'Maximum words per reasoning step'
          }
        },
        required: ['problem']
      }
    },
    {
      name: 'logic_solve',
      description: 'Solve a logic problem using Chain of Draft reasoning',
      parameters: {
        type: 'object',
        properties: {
          problem: {
            type: 'string',
            description: 'The logic problem to solve'
          },
          approach: {
            type: 'string',
            description: "Force 'CoD' or 'CoT' approach"
          },
          max_words_per_step: {
            type: 'number',
            description: 'Maximum words per reasoning step'
          }
        },
        required: ['problem']
      }
    },
    {
      name: 'get_performance_stats',
      description: 'Get performance statistics for CoD vs CoT approaches',
      parameters: {
        type: 'object',
        properties: {
          domain: {
            type: 'string',
            description: 'Filter for specific domain'
          }
        }
      }
    },
    {
      name: 'get_token_reduction',
      description: 'Get token reduction statistics for CoD vs CoT',
      parameters: {
        type: 'object',
        properties: {}
      }
    },
    {
      name: 'analyze_problem_complexity',
      description: 'Analyze the complexity of a problem',
      parameters: {
        type: 'object',
        properties: {
          problem: {
            type: 'string',
            description: 'The problem to analyze'
          },
          domain: {
            type: 'string',
            description: 'Problem domain',
            default: 'general'
          }
        },
        required: ['problem']
      }
    }
  ],
}));

// Start the server
async function runServer() {
  const transport = new StdioServerTransport();

  console.error("Chain of Draft MCP Server starting...");
  
  await server.listen(transport);
  
  console.error("Server started and listening");
}

// Run the server
runServer().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});