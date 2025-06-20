// Copyright 2024 The Temporal Editioner Contributors
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// 

// ABSOLUTE MINIMAL JAVASCRIPT EXECUTION TEST
console.log("🚀 EMERGENCY TEST: JavaScript is executing!");

// Test 1: Basic DOM manipulation without React
const rootElement = document.getElementById('root');
if (rootElement) {
  console.log("✅ Root element found");
  rootElement.innerHTML = `
    <div style="padding: 40px; background: #1a1a2e; color: #00ffaa; font-family: monospace; min-height: 100vh;">
      <h1>🫁 EMERGENCY LIFELINE - JavaScript Works!</h1>
      <p>✅ Bundle loaded and executing</p>
      <p>✅ DOM manipulation functional</p>
      <p>🔄 Issue is likely in React imports/setup</p>
      <div style="margin-top: 20px; padding: 20px; background: #333;">
        <p>Timestamp: ${new Date().toISOString()}</p>
        <p>User Agent: ${navigator.userAgent.slice(0, 50)}...</p>
      </div>
    </div>
  `;
  console.log("✅ DOM content injected successfully");
} else {
  console.error("💥 FATAL: Root element not found!");
}

// Test 2: Try basic React if DOM test works
setTimeout(() => {
  try {
    console.log("🧪 Attempting to load React...");
    const React = require('react');
    const ReactDOM = require('react-dom/client');
    console.log("✅ React modules loaded successfully");
    
    if (rootElement && React && ReactDOM) {
      const root = ReactDOM.createRoot(rootElement);
      root.render(React.createElement('div', {
        style: { 
          padding: 40, 
          backgroundColor: '#1a1a2e', 
          color: '#ffaa00', 
          fontFamily: 'monospace',
          minHeight: '100vh'
        }
      }, [
        React.createElement('h1', { key: 'h1' }, '🎯 REACT TEST SUCCESS!'),
        React.createElement('p', { key: 'p1' }, '✅ React is working'),
        React.createElement('p', { key: 'p2' }, '✅ ReactDOM rendering operational'),
        React.createElement('p', { key: 'p3' }, '🔄 Issue must be in App component imports')
      ]));
      console.log("✅ React test render completed");
    }
  } catch (error) {
    console.error("💥 React test failed:", error);
    if (rootElement) {
      rootElement.innerHTML += `
        <div style="margin-top: 20px; padding: 20px; background: #ff3333; color: white;">
          <h3>💥 React Load Error:</h3>
          <pre>${String(error)}</pre>
        </div>
      `;
    }
  }
}, 1000); 