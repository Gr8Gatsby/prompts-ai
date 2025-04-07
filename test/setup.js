// Add any global test setup here
import { afterEach } from 'vitest';
import { window } from 'happy-dom';

// Make sure we have a document and window
global.window = window;
global.document = window.document;
global.CustomElementRegistry = window.CustomElementRegistry;
global.customElements = window.customElements;

// runs a cleanup after each test case
afterEach(() => {
  // Clean up any elements added to the document
  document.body.innerHTML = '';
}); 