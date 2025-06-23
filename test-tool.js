#!/usr/bin/env node

import { spawn } from 'child_process';

function testToolExecution() {
  return new Promise((resolve, reject) => {
    const server = spawn('node', ['index.js'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    server.stdout.on('data', (data) => {
      output += data.toString();
    });

    server.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    // Send initialize request
    const initRequest = {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "test-client", version: "1.0.0" }
      }
    };

    server.stdin.write(JSON.stringify(initRequest) + '\n');

    setTimeout(() => {
      // Send initialized notification
      const initialized = {
        jsonrpc: "2.0",
        method: "notifications/initialized"
      };
      server.stdin.write(JSON.stringify(initialized) + '\n');

      // Test tool call
      const toolRequest = {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
          name: "rat",
          arguments: {
            thought: "This is a test thought to verify the Node.js server functionality. It demonstrates reasoning because we need to validate the metrics system works correctly.",
            nextThoughtNeeded: false,
            thoughtNumber: 1,
            totalThoughts: 1
          }
        }
      };

      server.stdin.write(JSON.stringify(toolRequest) + '\n');

      // Wait for response
      setTimeout(() => {
        server.kill();
        
        console.log('=== Tool Execution Test ===');
        
        const lines = output.split('\n').filter(line => line.trim());
        let toolExecuted = false;
        
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.id === 2 && parsed.result && parsed.result.content) {
              const resultText = parsed.result.content[0].text;
              const resultData = JSON.parse(resultText);
              
              console.log('✅ Tool executed successfully!');
              console.log(`   Metrics - Quality: ${resultData.metrics.quality.toFixed(3)}`);
              console.log(`   Metrics - Complexity: ${resultData.metrics.complexity.toFixed(3)}`);
              console.log(`   Metrics - Impact: ${resultData.metrics.impact.toFixed(3)}`);
              console.log(`   Total thoughts processed: ${resultData.analytics.total_thoughts}`);
              
              toolExecuted = true;
              break;
            }
          } catch (e) {
            // Ignore parsing errors
          }
        }
        
        if (toolExecuted) {
          console.log('✅ SUCCESS: Tool execution test passed');
          resolve(true);
        } else {
          console.log('❌ FAILED: Tool execution failed');
          console.log('Output:', output);
          console.log('Errors:', errorOutput);
          resolve(false);
        }
      }, 1000);
    }, 100);

    server.on('error', (err) => {
      console.error('Server error:', err);
      reject(err);
    });
  });
}

testToolExecution().then(success => {
  console.log(`\nTool test ${success ? 'PASSED' : 'FAILED'}`);
  process.exit(success ? 0 : 1);
}).catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});