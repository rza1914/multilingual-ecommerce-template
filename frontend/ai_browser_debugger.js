/*
 * AI Component Browser Debugger
 * This script analyzes the DOM for AI-related components and functionality.
 */

class AIComponentBrowserDebugger {
  constructor() {
    this.aiSelectors = [
      '[data-ai-component]',
      '[data-chat]',
      '[data-assistant]',
      '[data-smart]',
      '[data-intelligent]',
      '[data-recommendation]',
      '[data-analysis]',
      '[data-generation]',
      '[data-prediction]',
      '[data-personalization]',
      '.ai-component',
      '.chat-widget',
      '.recommendation-section',
      '.smart-search',
      '.ai-assistant',
      '.nlp-component',
      '.ml-component',
      '.generator-component'
    ];
    
    this.aiPatterns = [
      /ai/i,
      /artificial.*intelligence/i,
      /chat/i,
      /assistant/i,
      /bot/i,
      /conversation/i,
      /nlp/i,
      /natural.*language/i,
      /recommend/i,
      /smart/i,
      /intelligent/i,
      /cognitive/i,
      /neural/i,
      /generator/i,
      /completion/i,
      /embedding/i,
      /semantic/i,
      /context/i,
      /personaliz/i,
      /customiz/i,
      /adaptive/i,
      /learning/i,
      /predict/i,
      /prediction/i,
      /generation/i,
      /generate/i,
      /image.*search/i,
      /visual.*search/i,
      /ocr/i,
      /vision/i
    ];
    
    this.aiApiEndpoints = [
      /\/api\/ai/,
      /\/api\/chat/,
      /\/api\/nlp/,
      /\/api\/recommend/,
      /\/api\/generate/,
      /\/api\/analysis/,
      /\/api\/predict/,
      /\/api\/embed/
    ];
  }

  // Find all AI-related elements in the DOM
  findAIElements() {
    const elements = [];
    
    // Query elements using AI selectors
    this.aiSelectors.forEach(selector => {
      const found = document.querySelectorAll(selector);
      found.forEach(el => {
        if (!elements.includes(el)) {
          elements.push({
            element: el,
            selector: selector,
            attributes: this.getElementAttributes(el),
            textContent: el.textContent.substring(0, 100) + (el.textContent.length > 100 ? '...' : '')
          });
        }
      });
    });
    
    // Search all elements for AI patterns in text/content
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      if (!elements.some(aiEl => aiEl.element === el)) {
        const text = el.textContent + ' ' + el.getAttribute('class') + ' ' + el.getAttribute('id') + ' ' + el.getAttribute('data-testid') || '';
        for (const pattern of this.aiPatterns) {
          if (pattern.test(text)) {
            elements.push({
              element: el,
              pattern: pattern.toString(),
              attributes: this.getElementAttributes(el),
              textContent: text.substring(0, 100) + (text.length > 100 ? '...' : '')
            });
            break;
          }
        }
      }
    });
    
    return elements;
  }

  // Get element attributes for debugging
  getElementAttributes(element) {
    const attrs = {};
    for (let attr of element.attributes) {
      attrs[attr.name] = attr.value;
    }
    return attrs;
  }

  // Check for active network requests related to AI
  getActiveAIRequests() {
    const requests = [];
    
    // Check performance entries for network requests
    const entries = performance.getEntriesByType('resource');
    entries.forEach(entry => {
      if (this.aiApiEndpoints.some(pattern => pattern.test(entry.name))) {
        requests.push({
          url: entry.name,
          startTime: entry.startTime,
          duration: entry.duration,
          entry: entry
        });
      }
    });
    
    return requests;
  }

  // Check for AI-related JavaScript variables/functions
  findAIJSVariables() {
    const aiVars = [];
    const windowProps = Object.getOwnPropertyNames(window);
    
    for (const prop of windowProps) {
      if (typeof window[prop] === 'function' || typeof window[prop] === 'object') {
        for (const pattern of this.aiPatterns) {
          if (pattern.test(prop)) {
            aiVars.push({
              name: prop,
              type: typeof window[prop],
              value: typeof window[prop] === 'object' ? JSON.stringify(window[prop]).substring(0, 200) + '...' : window[prop]
            });
            break;
          }
        }
      }
    }
    
    return aiVars;
  }

  // Check for AI-related React components (if React DevTools is available)
  findReactAIComponents() {
    const reactComponents = [];
    
    // Check if React DevTools global variable exists
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      try {
        // Try to access React component tree if possible
        // This is a simplified approach - actual implementation would need React DevTools backend
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
          // Look for React-specific attributes that might indicate AI components
          const reactComponentName = el.getAttribute('data-reactroot') || 
                                    el.getAttribute('data-reactid') || 
                                    el.className.match(/React.*Component/)?.[0];
          if (reactComponentName) {
            for (const pattern of this.aiPatterns) {
              if (pattern.test(reactComponentName) || pattern.test(el.textContent)) {
                reactComponents.push({
                  element: el,
                  componentName: reactComponentName,
                  pattern: pattern.toString()
                });
                break;
              }
            }
          }
        });
      } catch (e) {
        console.log('Could not access React component tree:', e.message);
      }
    }
    
    return reactComponents;
  }

  // Generate comprehensive report
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      aiElements: this.findAIElements(),
      aiRequests: this.getActiveAIRequests(),
      aiJSVariables: this.findAIJSVariables(),
      reactAIComponents: this.findReactAIComponents(),
      summary: {
        aiElementsCount: 0,
        aiRequestsCount: 0,
        aiJSVariablesCount: 0,
        reactAIComponentsCount: 0
      }
    };
    
    report.summary.aiElementsCount = report.aiElements.length;
    report.summary.aiRequestsCount = report.aiRequests.length;
    report.summary.aiJSVariablesCount = report.aiJSVariables.length;
    report.summary.reactAIComponentsCount = report.reactAIComponents.length;
    
    return report;
  }

  // Print formatted report to console
  printReport() {
    const report = this.generateReport();
    
    console.group('🔍 AI Component Browser Debugger Report');
    console.log(`URL: ${report.url}`);
    console.log(`Timestamp: ${report.timestamp}`);
    
    console.group(`📊 Summary (${report.aiElements.length} AI elements found)`);
    console.table(report.summary);
    console.groupEnd();
    
    if (report.aiElements.length > 0) {
      console.group(`🤖 AI Elements Found (${report.aiElements.length})`);
      report.aiElements.forEach((item, index) => {
        console.group(`Element #${index + 1}`);
        console.log('Element:', item.element);
        console.log('Selector/Pattern:', item.selector || item.pattern);
        console.log('Attributes:', item.attributes);
        console.log('Text Content:', item.textContent);
        console.groupEnd();
      });
      console.groupEnd();
    } else {
      console.log('❌ No AI elements found in the DOM');
    }
    
    if (report.aiRequests.length > 0) {
      console.group(`📡 Active AI Requests (${report.aiRequests.length})`);
      console.table(report.aiRequests.map(req => ({
        URL: req.url,
        Duration: `${req.duration.toFixed(2)}ms`
      })));
      console.groupEnd();
    } else {
      console.log('❌ No active AI requests detected');
    }
    
    if (report.aiJSVariables.length > 0) {
      console.group(`🔧 AI JavaScript Variables (${report.aiJSVariables.length})`);
      console.table(report.aiJSVariables);
      console.groupEnd();
    }
    
    if (report.reactAIComponents.length > 0) {
      console.group(`⚛️ React AI Components (${report.reactAIComponents.length})`);
      console.table(report.reactAIComponents.map(comp => ({
        Component: comp.componentName,
        Pattern: comp.pattern
      })));
      console.groupEnd();
    }
    
    console.groupEnd();
    
    // Return the report for further processing if needed
    return report;
  }

  // Run the debugger and return results
  run() {
    return this.printReport();
  }
}

// Make the debugger globally available for manual use in browser console
window.AIDebugger = new AIComponentBrowserDebugger();

// Auto-run if script is executed directly
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('AI Component Browser Debugger loaded. Use window.AIDebugger.run() to analyze the page.');
  });
} else {
  console.log('AI Component Browser Debugger loaded. Use window.AIDebugger.run() to analyze the page.');
}