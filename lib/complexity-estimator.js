class ComplexityEstimator {
  constructor() {
    this.complexity_indicators = {
      math: [
        'integral', 'derivative', 'equation', 'theorem', 'proof', 'matrix', 
        'polynomial', 'differential', 'calculus', 'algebra', 'geometry',
        'probability', 'statistics', 'optimization', 'function'
      ],
      logic: [
        'premise', 'conclusion', 'syllogism', 'logical', 'reasoning',
        'argument', 'fallacy', 'valid', 'sound', 'deduction', 'induction',
        'contradiction', 'paradox', 'boolean', 'inference'
      ],
      code: [
        'algorithm', 'function', 'class', 'method', 'recursion', 'iteration',
        'complexity', 'runtime', 'memory', 'optimization', 'debug',
        'compile', 'syntax', 'error', 'exception', 'api'
      ],
      general: [
        'analyze', 'compare', 'evaluate', 'synthesize', 'complex',
        'multiple', 'various', 'several', 'relationship', 'interaction',
        'consequence', 'implication', 'factor', 'variable', 'constraint'
      ]
    };
  }

  analyzeProblem(problem, domain = 'general') {
    const text = problem.toLowerCase();
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Basic metrics
    const word_count = words.length;
    const sentence_count = sentences.length;
    const words_per_sentence = word_count / sentence_count;
    
    // Domain-specific complexity indicators
    const domain_indicators = this.complexity_indicators[domain] || this.complexity_indicators.general;
    const found_indicators = [];
    let indicator_count = 0;
    
    domain_indicators.forEach(indicator => {
      if (text.includes(indicator)) {
        found_indicators.push(indicator);
        indicator_count++;
      }
    });
    
    // Question complexity
    const question_count = (text.match(/\?/g) || []).length;
    
    // Calculate complexity score
    let complexity_score = 50; // Base score
    
    // Adjust for length
    if (word_count > 50) complexity_score += 20;
    if (word_count > 100) complexity_score += 30;
    
    // Adjust for sentence complexity
    if (words_per_sentence > 15) complexity_score += 15;
    if (words_per_sentence > 25) complexity_score += 25;
    
    // Adjust for domain indicators
    complexity_score += indicator_count * 10;
    
    // Adjust for multiple questions
    complexity_score += question_count * 15;
    
    // Adjust for domain
    if (domain === 'math') complexity_score += 20;
    if (domain === 'logic') complexity_score += 15;
    if (domain === 'code') complexity_score += 25;
    
    // Cap the score
    complexity_score = Math.min(complexity_score, 200);
    
    return {
      word_count,
      sentence_count,
      words_per_sentence,
      indicator_count,
      found_indicators,
      question_count,
      estimated_complexity: complexity_score
    };
  }

  recommendApproach(complexity_score) {
    if (complexity_score > 120) {
      return { approach: 'CoD', reason: 'High complexity benefits from draft iteration' };
    } else if (complexity_score > 80) {
      return { approach: 'CoT', reason: 'Medium complexity suitable for step-by-step reasoning' };
    } else {
      return { approach: 'CoT', reason: 'Low complexity can be solved directly' };
    }
  }

  recommendWordLimit(complexity_score) {
    if (complexity_score > 150) return 150;
    if (complexity_score > 100) return 120;
    if (complexity_score > 75) return 100;
    return 75;
  }
}

module.exports = new ComplexityEstimator();