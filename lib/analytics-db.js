class AnalyticsDatabase {
  constructor() {
    this.solutions = [];
    this.performance_stats = new Map();
  }

  recordSolution(data) {
    const record = {
      ...data,
      timestamp: new Date().toISOString(),
      id: this.generateId()
    };
    
    this.solutions.push(record);
    this.updatePerformanceStats(record);
  }

  updatePerformanceStats(record) {
    const key = `${record.domain}_${record.approach}`;
    
    if (!this.performance_stats.has(key)) {
      this.performance_stats.set(key, {
        domain: record.domain,
        approach: record.approach,
        total_tokens: 0,
        total_time: 0,
        count: 0,
        accuracy_scores: []
      });
    }
    
    const stats = this.performance_stats.get(key);
    stats.total_tokens += record.token_count;
    stats.total_time += record.execution_time_ms;
    stats.count += 1;
  }

  getPerformanceByDomain(domain = null) {
    const results = [];
    
    this.performance_stats.forEach((stats, key) => {
      if (!domain || stats.domain === domain) {
        results.push({
          domain: stats.domain,
          approach: stats.approach,
          avg_tokens: stats.total_tokens / stats.count,
          avg_time_ms: stats.total_time / stats.count,
          accuracy: stats.accuracy_scores.length > 0 ? 
            stats.accuracy_scores.reduce((a, b) => a + b) / stats.accuracy_scores.length : null,
          count: stats.count
        });
      }
    });
    
    return results;
  }

  getTokenReductionStats() {
    const domainStats = new Map();
    
    // Group by domain
    this.performance_stats.forEach((stats, key) => {
      if (!domainStats.has(stats.domain)) {
        domainStats.set(stats.domain, { cod: null, cot: null });
      }
      
      const domainData = domainStats.get(stats.domain);
      if (stats.approach === 'CoD') {
        domainData.cod = stats.total_tokens / stats.count;
      } else if (stats.approach === 'CoT') {
        domainData.cot = stats.total_tokens / stats.count;
      }
    });
    
    const results = [];
    domainStats.forEach((data, domain) => {
      if (data.cod && data.cot) {
        const reduction = ((data.cot - data.cod) / data.cot) * 100;
        results.push({
          domain,
          cod_avg_tokens: data.cod,
          cot_avg_tokens: data.cot,
          reduction_percentage: reduction,
          count: this.solutions.filter(s => s.domain === domain).length
        });
      }
    });
    
    return results;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Export/import methods for persistence
  exportData() {
    return {
      solutions: this.solutions,
      performance_stats: Array.from(this.performance_stats.entries())
    };
  }

  importData(data) {
    this.solutions = data.solutions || [];
    this.performance_stats = new Map(data.performance_stats || []);
  }
}

module.exports = new AnalyticsDatabase();