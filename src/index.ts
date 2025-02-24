#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import chalk from 'chalk';

interface ThoughtMetrics {
  complexity: number;
  depth: number;
  quality: number;
  impact: number;
}

interface ThoughtData {
  thought: string;
  thoughtNumber: number;
  totalThoughts: number;
  nextThoughtNeeded: boolean;
  isRevision?: boolean;
  revisesThought?: number;
  branchFromThought?: number;
  branchId?: string;
  needsMoreThoughts?: boolean;
  timestamp?: number;
  confidence?: number;
  metadata?: Record<string, unknown>;
  metrics?: ThoughtMetrics;
}

class RatServer {
  private thoughtHistory: ThoughtData[] = [];
  private branches: Record<string, ThoughtData[]> = {};
  private analytics = {
    chainEffectiveness: 0,
    revisionImpact: 0,
    branchSuccessRate: 0,
    overallQuality: 0
  };

  private calculateMetrics(thought: string, isRevision?: boolean, branchFromThought?: number): ThoughtMetrics {
    const complexity = Math.min((thought.match(/[.!?]/g)?.length || 0) * 0.2, 1);
    const depth = Math.min((thought.split(' ').length / 50), 1);
    const quality = isRevision ? 0.8 : (branchFromThought ? 0.7 : 0.6);
    const impact = this.calculateThoughtImpact(thought);
    
    return { complexity, depth, quality, impact };
  }

  private calculateThoughtImpact(thought: string): number {
    const keywordImpact = ['because', 'therefore', 'however', 'consequently'].some(
      keyword => thought.toLowerCase().includes(keyword)
    ) ? 0.3 : 0;
    const lengthImpact = Math.min(thought.length / 500, 0.4);
    const structureImpact = thought.includes(':') ? 0.3 : 0;
    
    return Math.min(keywordImpact + lengthImpact + structureImpact, 1);
  }

  private calculateConfidence(thought: string): number {
    const hasStructure = thought.includes(':') || thought.includes('-');
    const hasReasoning = thought.toLowerCase().includes('because') || 
                        thought.toLowerCase().includes('therefore');
    const isDetailedEnough = thought.length > 100;

    return (hasStructure ? 0.3 : 0) + 
           (hasReasoning ? 0.4 : 0) + 
           (isDetailedEnough ? 0.3 : 0);
  }

  private updateAnalytics(thoughtData: ThoughtData): void {
    if (!thoughtData.metrics) return;

    const { complexity, depth, quality, impact } = thoughtData.metrics;
    const score = (complexity + depth + quality + impact) / 4;

    this.analytics.overallQuality = (this.analytics.overallQuality + score) / 2;

    if (thoughtData.isRevision) {
      this.analytics.revisionImpact = (this.analytics.revisionImpact + impact) / 2;
    }

    if (thoughtData.branchFromThought) {
      this.analytics.branchSuccessRate = (this.analytics.branchSuccessRate + quality) / 2;
    }

    this.analytics.chainEffectiveness = this.thoughtHistory.length > 1 ? 
      (this.analytics.chainEffectiveness + score) / 2 : score;
  }

  private validateThoughtData(input: unknown): ThoughtData {
    const data = input as Record<string, unknown>;

    if (!data.thought || typeof data.thought !== 'string') {
      throw new Error('Invalid thought: must be a string');
    }
    if (!data.thoughtNumber || typeof data.thoughtNumber !== 'number') {
      throw new Error('Invalid thoughtNumber: must be a number');
    }
    if (!data.totalThoughts || typeof data.totalThoughts !== 'number') {
      throw new Error('Invalid totalThoughts: must be a number');
    }
    if (typeof data.nextThoughtNeeded !== 'boolean') {
      throw new Error('Invalid nextThoughtNeeded: must be a boolean');
    }

    const timestamp = Date.now();
    const confidence = this.calculateConfidence(data.thought as string);
    const metrics = this.calculateMetrics(
      data.thought as string,
      data.isRevision as boolean,
      data.branchFromThought as number
    );

    return {
      thought: data.thought,
      thoughtNumber: data.thoughtNumber,
      totalThoughts: data.totalThoughts,
      nextThoughtNeeded: data.nextThoughtNeeded,
      isRevision: data.isRevision as boolean | undefined,
      revisesThought: data.revisesThought as number | undefined,
      branchFromThought: data.branchFromThought as number | undefined,
      branchId: data.branchId as string | undefined,
      needsMoreThoughts: data.needsMoreThoughts as boolean | undefined,
      timestamp,
      confidence,
      metrics,
      metadata: {}
    };
  }

  private formatThought(thoughtData: ThoughtData): string {
    const { thoughtNumber, totalThoughts, thought, isRevision, revisesThought, branchFromThought, branchId } = thoughtData;

    let prefix = '';
    let context = '';

    if (isRevision) {
      prefix = chalk.yellow('🔄 Revision');
      context = ` (revising thought ${revisesThought})`;
    } else if (branchFromThought) {
      prefix = chalk.green('🌿 Branch');
      context = ` (from thought ${branchFromThought}, ID: ${branchId})`;
    } else {
      prefix = chalk.blue('💭 Thought');
      context = '';
    }

    const header = `${prefix} ${thoughtNumber}/${totalThoughts}${context}`;
    const border = '─'.repeat(Math.max(header.length, thought.length) + 4);

    return `
┌${border}┐
│ ${header} │
├${border}┤
│ ${thought.padEnd(border.length - 2)} │
└${border}┘`;
  }

  public processThought(input: unknown): { content: Array<{ type: string; text: string }>; isError?: boolean } {
    try {
      const validatedInput = this.validateThoughtData(input);

      if (validatedInput.thoughtNumber > validatedInput.totalThoughts) {
        validatedInput.totalThoughts = validatedInput.thoughtNumber;
      }

      this.thoughtHistory.push(validatedInput);
      this.updateAnalytics(validatedInput);

      if (validatedInput.branchFromThought && validatedInput.branchId) {
        if (!this.branches[validatedInput.branchId]) {
          this.branches[validatedInput.branchId] = [];
        }
        this.branches[validatedInput.branchId].push(validatedInput);
      }

      const formattedThought = this.formatThought(validatedInput);
      console.error(formattedThought);

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            thoughtNumber: validatedInput.thoughtNumber,
            totalThoughts: validatedInput.totalThoughts,
            nextThoughtNeeded: validatedInput.nextThoughtNeeded,
            branches: Object.keys(this.branches),
            thoughtHistoryLength: this.thoughtHistory.length,
            metrics: validatedInput.metrics,
            confidence: validatedInput.confidence,
            analytics: this.analytics,
            timestamp: validatedInput.timestamp
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: error instanceof Error ? error.message : String(error),
            status: 'failed'
          }, null, 2)
        }],
        isError: true
      };
    }
  }
}

const RAT_TOOL: Tool = {
  name: "rat",
  displayName: "rat",
  description: `A context-aware reasoning system that orchestrates structured thought processes through dynamic trajectories.

Core Capabilities:
- Maintains adaptive thought chains with branching and revision capabilities
- Implements iterative hypothesis generation and validation cycles
- Preserves context coherence across non-linear reasoning paths
- Supports dynamic scope adjustment and trajectory refinement

Reasoning Patterns:
- Sequential analysis with backtracking capability
- Parallel exploration through managed branch contexts
- Recursive refinement via structured revision cycles
- Hypothesis validation through multi-step verification

Parameters:
thought: Structured reasoning step that supports:
• Primary analysis chains
• Hypothesis formulation/validation
• Branch exploration paths
• Revision proposals
• Context preservation markers
• Verification checkpoints

next_thought_needed: Signal for continuation of reasoning chain
thought_number: Position in current reasoning trajectory
total_thoughts: Dynamic scope indicator (adjustable)
is_revision: Marks recursive refinement steps
revises_thought: References target of refinement
branch_from_thought: Indicates parallel exploration paths
branch_id: Context identifier for parallel chains
needs_more_thoughts: Signals scope expansion requirement

Execution Protocol:
1. Initialize with scope estimation
2. Generate structured reasoning steps
3. Validate hypotheses through verification cycles
4. Maintain context coherence across branches
5. Implement revisions through recursive refinement
6. Signal completion on validation success

The system maintains solution integrity through continuous validation cycles while supporting dynamic scope adjustment and non-linear exploration paths.`,
  inputSchema: {
    type: "object",
    properties: {
      thought: {
        type: "string",
        description: "Your current thinking step"
      },
      nextThoughtNeeded: {
        type: "boolean",
        description: "Whether another thought step is needed"
      },
      thoughtNumber: {
        type: "integer",
        description: "Current thought number",
        minimum: 1
      },
      totalThoughts: {
        type: "integer",
        description: "Estimated total thoughts needed",
        minimum: 1
      },
      isRevision: {
        type: "boolean",
        description: "Whether this revises previous thinking"
      },
      revisesThought: {
        type: "integer",
        description: "Which thought is being reconsidered",
        minimum: 1
      },
      branchFromThought: {
        type: "integer",
        description: "Branching point thought number",
        minimum: 1
      },
      branchId: {
        type: "string",
        description: "Branch identifier"
      },
      needsMoreThoughts: {
        type: "boolean",
        description: "If more thoughts are needed"
      }
    },
    required: ["thought", "nextThoughtNeeded", "thoughtNumber", "totalThoughts"]
  }
};

const server = new Server(
  {
    name: "server-retrieval-augmented-thinking",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const thinkingServer = new RatServer();

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [RAT_TOOL],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "rat") {
    return thinkingServer.processThought(request.params.arguments);
  }

  return {
    content: [{
      type: "text",
      text: `Unknown tool: ${request.params.name}`
    }],
    isError: true
  };
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Retrieval Augmented Thinking MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});