// Add any global test setup here
import { afterEach, beforeEach } from 'vitest';

// Reset the custom elements registry before each test
beforeEach(() => {
  // Store existing custom elements
  const existingElements = Array.from(window.customElements.elements || []);
  
  // Create a new custom elements registry
  window.customElements = new CustomElementRegistry();
  
  // Re-define any built-in elements that might be needed
  existingElements.forEach(([name, constructor]) => {
    try {
      window.customElements.define(name, constructor);
    } catch (e) {
      // Ignore errors for already defined elements
    }
  });
});

// runs a cleanup after each test case
afterEach(() => {
  // Clean up any elements added to the document
  document.body.innerHTML = '';
}); 