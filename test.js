#!/usr/bin/env node

import { spawn } from 'child_process';

function testMCPServer() {
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

    // Send initialized notification
    setTimeout(() => {
      const initialized = {
        jsonrpc: "2.0",
        method: "notifications/initialized"
      };
      server.stdin.write(JSON.stringify(initialized) + '\n');

      // Send tools/list request
      const toolsRequest = {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/list",
        params: {}
      };
      server.stdin.write(JSON.stringify(toolsRequest) + '\n');

      // Wait for response
      setTimeout(() => {
        server.kill();
        
        console.log('=== Server Output ===');
        console.log(output);
        console.log('=== Server Errors ===');
        console.log(errorOutput);
        
        // Check if we got valid responses
        const lines = output.split('\n').filter(line => line.trim());
        let hasInitResponse = false;
        let hasToolsResponse = false;
        
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.id === 1 && parsed.result) {
              hasInitResponse = true;
              console.log('✅ Initialize response received');
            }
            if (parsed.id === 2 && parsed.result && parsed.result.tools) {
              hasToolsResponse = true;
              console.log('✅ Tools response received');
              console.log(`   Found ${parsed.result.tools.length} tools`);
            }
          } catch (e) {
            // Ignore non-JSON lines
          }
        }
        
        if (hasInitResponse && hasToolsResponse) {
          console.log('✅ SUCCESS: Node.js MCP server is working correctly!');
          resolve(true);
        } else {
          console.log('❌ FAILED: Server did not respond correctly');
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

testMCPServer().then(success => {
  console.log(`\nTest ${success ? 'PASSED' : 'FAILED'}`);
  process.exit(success ? 0 : 1);
}).catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
