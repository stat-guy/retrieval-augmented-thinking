#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ToolSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Data structures matching the original Python implementation
class ThoughtMetrics {
  constructor() {
    this.complexity = 0;
    this.depth = 0;
    this.quality = 0;
    this.impact = 0;
    this.confidence = 0;
  }
}

class ThoughtData {
  constructor(data) {
    this.content = data.thought || "";
    this.thought_number = data.thoughtNumber || 1;
    this.total_thoughts = data.totalThoughts || 1;
    this.next_thought_needed = data.nextThoughtNeeded || false;
    this.is_revision = data.isRevision || false;
    this.revises_thought = data.revisesThought || null;
    this.branch_from_thought = data.branchFromThought || null;
    this.branch_id = data.branchId || null;
    this.needs_more_thoughts = data.needsMoreThoughts || false;
    this.timestamp = Date.now();
    this.metrics = new ThoughtMetrics();
    this.processed = false;
  }
}

class Analytics {
  constructor() {
    this.total_thoughts = 0;
    this.total_revisions = 0;
    this.total_branches = 0;
    this.chain_effectiveness = 0;
    this.revision_impact = 0;
    this.branch_success_rate = 0;
    this.average_quality = 0;
    this.quality_trend = [];
    this.session_start = Date.now();
    this.last_update = Date.now();
  }

  updateMetrics(thought) {
    this.total_thoughts += 1;
    this.last_update = Date.now();
    
    if (thought.is_revision) {
      this.total_revisions += 1;
    }
    
    if (thought.branch_id) {
      this.total_branches += 1;
    }
    
    // Update quality tracking
    const currentQuality = thought.metrics.quality;
    this.quality_trend.push(currentQuality);
    
    // Keep only last 20 quality scores
    if (this.quality_trend.length > 20) {
      this.quality_trend = this.quality_trend.slice(-20);
    }
    
    // Recalculate average quality
    if (this.quality_trend.length > 0) {
      this.average_quality = this.quality_trend.reduce((a, b) => a + b) / this.quality_trend.length;
    }
    
    // Update effectiveness metrics
    this._calculateEffectiveness();
  }

  _calculateEffectiveness() {
    if (this.total_thoughts > 0) {
      // Chain effectiveness based on quality trend
      if (this.quality_trend.length >= 2) {
        const recent = this.quality_trend.slice(-5);
        const early = this.quality_trend.slice(0, 5);
        const recentAvg = recent.reduce((a, b) => a + b) / recent.length;
        const earlyAvg = early.reduce((a, b) => a + b) / early.length;
        this.chain_effectiveness = earlyAvg > 0 ? Math.max(0, (recentAvg - earlyAvg) / earlyAvg) : 0;
      }
      
      // Revision impact
      if (this.total_thoughts > 0) {
        this.revision_impact = Math.min(1.0, this.total_revisions / this.total_thoughts * 2);
      }
      
      // Branch success rate (placeholder)
      if (this.total_branches > 0) {
        this.branch_success_rate = 0.7;
      }
    }
  }
}

class ThoughtProcessor {
  constructor() {
    this.processed_count = 0;
    this.reasoning_keywords = [
      'because', 'therefore', 'thus', 'hence', 'consequently', 
      'since', 'given', 'assuming', 'implies', 'suggests',
      'indicates', 'demonstrates', 'proves', 'shows', 'reveals'
    ];
    this.impact_keywords = [
      'important', 'critical', 'significant', 'key', 'essential',
      'fundamental', 'crucial', 'vital', 'major', 'primary'
    ];
  }

  async processThought(thoughtData) {
    // Validate
    this._validateThought(thoughtData);
    
    // Sanitize content
    thoughtData.content = this._sanitizeContent(thoughtData.content);
    
    // Calculate metrics
    thoughtData.metrics = this._calculateMetrics(thoughtData);
    
    // Mark as processed
    thoughtData.processed = true;
    thoughtData.timestamp = Date.now();
    this.processed_count++;
    
    return thoughtData;
  }

  _validateThought(thought) {
    if (!thought.content || !thought.content.trim()) {
      throw new Error("Thought content cannot be empty");
    }
    
    if (thought.thought_number < 1) {
      throw new Error("Thought number must be positive");
    }
    
    if (thought.total_thoughts < 1) {
      throw new Error("Total thoughts must be positive");
    }
    
    if (thought.thought_number > thought.total_thoughts && !thought.needs_more_thoughts) {
      throw new Error("Thought number cannot exceed total thoughts unless extending");
    }
  }

  _sanitizeContent(content) {
    // Remove excessive whitespace
    content = content.replace(/\s+/g, ' ').trim();
    
    // Remove problematic characters
    content = content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    
    // Normalize line endings
    content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Limit length
    if (content.length > 10000) {
      content = content.substring(0, 10000) + "... [truncated]";
    }
    
    return content;
  }

  _calculateMetrics(thought) {
    const content = thought.content.toLowerCase();
    
    // Calculate complexity
    const complexity = this._calculateComplexity(thought.content);
    
    // Calculate depth
    const depth = this._calculateDepth(thought.content);
    
    // Calculate impact
    const impact = this._calculateImpact(content);
    
    // Calculate quality
    const quality = this._calculateQuality(complexity, depth, impact, thought);
    
    // Calculate confidence
    const confidence = this._calculateConfidence(content, complexity, depth);
    
    thought.metrics.complexity = Math.round(complexity * 1000) / 1000;
    thought.metrics.depth = Math.round(depth * 1000) / 1000;
    thought.metrics.quality = Math.round(quality * 1000) / 1000;
    thought.metrics.impact = Math.round(impact * 1000) / 1000;
    thought.metrics.confidence = Math.round(confidence * 1000) / 1000;
    
    return thought.metrics;
  }

  _calculateComplexity(content) {
    const colons = (content.match(/:/g) || []).length;
    const semicolons = (content.match(/;/g) || []).length;
    const dashes = (content.match(/-/g) || []).length;
    const parentheses = (content.match(/[()]/g) || []).length;
    const questions = (content.match(/\?/g) || []).length;
    
    const sentences = content.split(/[.!?]+/).filter(s => s.trim()).length;
    
    const punctuationScore = (colons * 0.3 + semicolons * 0.2 + dashes * 0.1 + 
                             parentheses * 0.05 + questions * 0.2);
    const sentenceComplexity = sentences * 0.1;
    
    return Math.min(1.0, (punctuationScore + sentenceComplexity) / 10);
  }

  _calculateDepth(content) {
    const wordCount = content.split(/\s+/).length;
    const charCount = content.length;
    
    const wordDepth = Math.min(1.0, wordCount / 100);
    const charDepth = Math.min(1.0, charCount / 500);
    
    return (wordDepth * 0.6 + charDepth * 0.4);
  }

  _calculateImpact(contentLower) {
    const reasoningScore = this.reasoning_keywords.filter(keyword => 
      contentLower.includes(keyword)).length;
    
    const impactScore = this.impact_keywords.filter(keyword => 
      contentLower.includes(keyword)).length;
    
    const structurePatterns = [
      /\b(first|second|third|finally|lastly)\b/,
      /\b(step \d+|\d+\.|\d+\))/,
      /\b(therefore|thus|hence|consequently)\b/
    ];
    
    const structureScore = structurePatterns.filter(pattern => 
      pattern.test(contentLower)).length;
    
    const totalScore = reasoningScore + impactScore + structureScore;
    return Math.min(1.0, totalScore / 8);
  }

  _calculateQuality(complexity, depth, impact, thought) {
    let baseQuality = (complexity * 0.3 + depth * 0.4 + impact * 0.3);
    
    if (thought.is_revision) {
      baseQuality *= 1.1; // 10% bonus for revisions
    }
    
    if (thought.branch_id) {
      baseQuality *= 1.05; // 5% bonus for branches
    }
    
    return Math.min(1.0, baseQuality);
  }

  _calculateConfidence(contentLower, complexity, depth) {
    const uncertaintyPatterns = [
      /\b(maybe|perhaps|possibly|might|could be|uncertain)\b/,
      /\b(not sure|unclear|ambiguous)\b/
    ];
    
    const uncertaintyScore = uncertaintyPatterns.filter(pattern => 
      pattern.test(contentLower)).length;
    
    const certaintyPatterns = [
      /\b(clearly|obviously|definitely|certainly|undoubtedly)\b/,
      /\b(proven|established|confirmed)\b/
    ];
    
    const certaintyScore = certaintyPatterns.filter(pattern => 
      pattern.test(contentLower)).length;
    
    const structureConfidence = (complexity + depth) / 2;
    const languageAdjustment = (certaintyScore - uncertaintyScore) * 0.1;
    
    return Math.max(0.0, Math.min(1.0, structureConfidence + languageAdjustment));
  }
}

// Main server class
class RatServer {
  constructor() {
    this.thought_history = [];
    this.analytics = new Analytics();
    this.processor = new ThoughtProcessor();
  }

  async processThought(arguments_obj) {
    try {
      // Create thought data
      const thoughtData = new ThoughtData(arguments_obj);
      
      // Process the thought
      const processedThought = await this.processor.processThought(thoughtData);
      
      // Add to history
      this.thought_history.push(processedThought);
      
      // Update analytics
      this.analytics.updateMetrics(processedThought);
      
      // Generate visual output
      const visualOutput = this._formatThoughtDisplay(processedThought);
      
      // Create response
      const responseData = {
        thought_number: processedThought.thought_number,
        total_thoughts: processedThought.total_thoughts,
        metrics: {
          complexity: processedThought.metrics.complexity,
          depth: processedThought.metrics.depth,
          quality: processedThought.metrics.quality,
          impact: processedThought.metrics.impact,
          confidence: processedThought.metrics.confidence
        },
        analytics: {
          total_thoughts: this.analytics.total_thoughts,
          average_quality: this.analytics.average_quality,
          chain_effectiveness: this.analytics.chain_effectiveness
        },
        next_thought_needed: processedThought.next_thought_needed,
        visual_output: visualOutput
      };

      return {
        content: [{
          type: "text",
          text: JSON.stringify(responseData, null, 2)
        }]
      };

    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: error.message,
            status: 'failed'
          }, null, 2)
        }],
        isError: true
      };
    }
  }

  _formatThoughtDisplay(thought) {
    // Create title based on thought type
    let title;
    if (thought.is_revision) {
      title = `💭 Revision of Thought ${thought.revises_thought}`;
    } else if (thought.branch_id) {
      title = `🌿 Branch ${thought.branch_id} from Thought ${thought.branch_from_thought}`;
    } else {
      title = `💭 Thought ${thought.thought_number}/${thought.total_thoughts}`;
    }
    
    // Create metrics display
    const metricsText = `Complexity: ${thought.metrics.complexity.toFixed(2)} | ` +
                        `Depth: ${thought.metrics.depth.toFixed(2)} | ` +
                        `Quality: ${thought.metrics.quality.toFixed(2)} | ` +
                        `Impact: ${thought.metrics.impact.toFixed(2)} | ` +
                        `Confidence: ${thought.metrics.confidence.toFixed(2)}`;
    
    // Format content
    const contentLines = thought.content.split('\n').map(line => line.trim());
    const formattedContent = contentLines.join('\n');
    
    // Create the display
    const borderLength = 60;
    const titleBorder = '─'.repeat(Math.max(0, borderLength - title.length - 4));
    const metricsBorder = '─'.repeat(50);
    
    const displayParts = [
      `┌─ ${title} ─${titleBorder}┐`,
      `│ ${formattedContent.substring(0, 56).padEnd(58)} │`,
      `├─ Metrics ─${metricsBorder}┤`,
      `│ ${metricsText.substring(0, 56).padEnd(58)} │`,
      `└${'─'.repeat(borderLength)}┘`
    ];
    
    return displayParts.join('\n');
  }
}

// Define the RAT tool
const RAT_TOOL = {
  name: "rat",
  description: "A context-aware reasoning system that orchestrates structured thought processes through dynamic trajectories.\n\nCore Capabilities:\n- Maintains adaptive thought chains with branching and revision capabilities\n- Implements iterative hypothesis generation and validation cycles\n- Preserves context coherence across non-linear reasoning paths\n- Supports dynamic scope adjustment and trajectory refinement\n\nReasoning Patterns:\n- Sequential analysis with backtracking capability\n- Parallel exploration through managed branch contexts\n- Recursive refinement via structured revision cycles\n- Hypothesis validation through multi-step verification\n\nParameters:\nthought: Structured reasoning step that supports:\n• Primary analysis chains\n• Hypothesis formulation/validation\n• Branch exploration paths\n• Revision proposals\n• Context preservation markers\n• Verification checkpoints\n\nnext_thought_needed: Signal for continuation of reasoning chain\nthought_number: Position in current reasoning trajectory\ntotal_thoughts: Dynamic scope indicator (adjustable)\nis_revision: Marks recursive refinement steps\nrevises_thought: References target of refinement\nbranch_from_thought: Indicates parallel exploration paths\nbranch_id: Context identifier for parallel chains\nneeds_more_thoughts: Signals scope expansion requirement\n\nExecution Protocol:\n1. Initialize with scope estimation\n2. Generate structured reasoning steps\n3. Validate hypotheses through verification cycles\n4. Maintain context coherence across branches\n5. Implement revisions through recursive refinement\n6. Signal completion on validation success\n\nThe system maintains solution integrity through continuous validation cycles while supporting dynamic scope adjustment and non-linear exploration paths.",
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
        minimum: 1,
        description: "Current thought number"
      },
      totalThoughts: {
        type: "integer",
        minimum: 1,
        description: "Estimated total thoughts needed"
      },
      isRevision: {
        type: "boolean",
        description: "Whether this revises previous thinking"
      },
      revisesThought: {
        type: "integer",
        minimum: 1,
        description: "Which thought is being reconsidered"
      },
      branchFromThought: {
        type: "integer",
        minimum: 1,
        description: "Branching point thought number"
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

// Create and configure server
const server = new Server(
  {
    name: "mcp-server-rat-node",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const ratServer = new RatServer();

// Set up request handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [RAT_TOOL],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "rat") {
    return ratServer.processThought(request.params.arguments);
  }

  return {
    content: [{
      type: "text",
      text: `Unknown tool: ${request.params.name}`
    }],
    isError: true
  };
});

// Run the server
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("RAT MCP Server (Node.js) running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
