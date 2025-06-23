const OpenAI = require('openai');
const complexityEstimator = require('./complexity-estimator');
const analyticsDb = require('./analytics-db');

class ChainOfDraftClient {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here'
    });
  }

  async solveWithReasoning(args) {
    const startTime = Date.now();
    const { problem, domain = 'general', max_words_per_step, approach, enforce_format = true, adaptive_word_limit = true } = args;
    
    // Analyze complexity
    const complexity = complexityEstimator.analyzeProblem(problem, domain);
    
    // Determine word limit
    let wordLimit = max_words_per_step;
    if (adaptive_word_limit && !wordLimit) {
      wordLimit = Math.min(Math.max(complexity.estimated_complexity, 50), 150);
    } else if (!wordLimit) {
      wordLimit = 100;
    }
    
    // Determine approach
    let selectedApproach = approach;
    if (!selectedApproach) {
      selectedApproach = complexity.estimated_complexity > 100 ? 'CoD' : 'CoT';
    }
    
    // Generate reasoning
    const prompt = this.buildPrompt(problem, domain, wordLimit, selectedApproach, enforce_format);
    
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
        temperature: 0.7
      });
      
      const content = response.choices[0].message.content;
      const executionTime = Date.now() - startTime;
      const tokenCount = this.estimateTokens(content);
      
      // Parse the response
      const { reasoning_steps, final_answer } = this.parseResponse(content);
      
      // Store analytics
      analyticsDb.recordSolution({
        problem,
        domain,
        approach: selectedApproach,
        word_limit: wordLimit,
        reasoning_steps,
        final_answer,
        token_count: tokenCount,
        execution_time_ms: executionTime,
        complexity: complexity.estimated_complexity
      });
      
      return {
        approach: selectedApproach,
        word_limit: wordLimit,
        reasoning_steps,
        final_answer,
        token_count: tokenCount,
        execution_time_ms: executionTime,
        complexity: complexity.estimated_complexity
      };
      
    } catch (error) {
      console.error('Error in Chain of Draft reasoning:', error);
      throw new Error(`Failed to generate reasoning: ${error.message}`);
    }
  }
  
  buildPrompt(problem, domain, wordLimit, approach, enforceFormat) {
    const basePrompt = `You are solving a ${domain} problem using ${approach === 'CoD' ? 'Chain of Draft' : 'Chain of Thought'} reasoning.

Problem: ${problem}

${approach === 'CoD' ? this.buildCoDPrompt(wordLimit, enforceFormat) : this.buildCoTPrompt(wordLimit, enforceFormat)}`;
    
    return basePrompt;
  }
  
  buildCoDPrompt(wordLimit, enforceFormat) {
    return `Use Chain of Draft reasoning:
1. Create multiple draft solutions (2-3 drafts)
2. For each draft, provide concise reasoning${enforceFormat ? ` (max ${wordLimit} words per step)` : ''}
3. Compare and refine drafts
4. Provide final answer

Format your response as:
DRAFT 1: [reasoning]
DRAFT 2: [reasoning] 
DRAFT 3: [reasoning]
COMPARISON: [analysis of drafts]
FINAL ANSWER: [final solution]`;
  }
  
  buildCoTPrompt(wordLimit, enforceFormat) {
    return `Use Chain of Thought reasoning:
1. Break down the problem step by step
2. Show your work for each step${enforceFormat ? ` (max ${wordLimit} words per step)` : ''}
3. Build toward the final answer

Format your response as:
STEP 1: [reasoning]
STEP 2: [reasoning]
STEP 3: [reasoning]
...
FINAL ANSWER: [final solution]`;
  }
  
  parseResponse(content) {
    const lines = content.split('\n').filter(line => line.trim());
    const reasoning_steps = [];
    let final_answer = '';
    
    for (const line of lines) {
      if (line.startsWith('DRAFT') || line.startsWith('STEP') || line.startsWith('COMPARISON')) {
        reasoning_steps.push(line);
      } else if (line.startsWith('FINAL ANSWER:')) {
        final_answer = line.replace('FINAL ANSWER:', '').trim();
      }
    }
    
    return {
      reasoning_steps: reasoning_steps.join('\n'),
      final_answer: final_answer || 'No final answer provided'
    };
  }
  
  estimateTokens(text) {
    // Simple token estimation (roughly 4 characters per token)
    return Math.ceil(text.length / 4);
  }
}

module.exports = new ChainOfDraftClient();