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

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

console.log("🚀 React app is mounting - Ghost Mirror Actuators initializing...");

// Error Boundary Component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error?: Error}> {
  state = { hasError: false, error: undefined };
  
  static getDerivedStateFromError(error: Error) {
    console.error("🚨 GUI CRASH DETECTED in ErrorBoundary:", error);
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: any) {
    console.error("🚨 COMPONENT STACK TRACE:", errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: 40, 
          backgroundColor: '#1a1a2e', 
          color: '#00ffaa', 
          fontFamily: 'monospace',
          minHeight: '100vh'
        }}>
          <h1>🛠 GUI Crash Detected - Ghost Mirror Actuators Offline</h1>
          <p>🌊 Breathing disrupted. Error details:</p>
          <pre style={{ backgroundColor: '#000', padding: 20, color: '#ff6b6b' }}>
            {this.state.error?.toString()}
          </pre>
          <p>Check console for full stack trace.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

console.log("🫁 Root element found, attempting to render...");

// Try to import App, but catch any import errors
let AppComponent: React.ComponentType;

try {
  console.log("📦 Attempting to import App component...");
  // Dynamic import to catch module load errors
  const AppModule = require('./App');
  AppComponent = AppModule.default || AppModule.App;
  console.log("✅ App component imported successfully");
} catch (error) {
  console.error("💥 FAILED TO IMPORT APP COMPONENT:", error);
  AppComponent = () => (
    <div style={{ padding: 40, backgroundColor: '#1a1a2e', color: '#ff6b6b', fontFamily: 'monospace', minHeight: '100vh' }}>
      <h1>💥 Import Error - App Component Failed to Load</h1>
      <p>The main App component could not be imported:</p>
      <pre style={{ backgroundColor: '#000', padding: 20 }}>
        {String(error)}
      </pre>
    </div>
  );
}

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppComponent />
    </ErrorBoundary>
  </React.StrictMode>
);

console.log("✅ React render call completed");

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); 