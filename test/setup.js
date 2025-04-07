// Add any global test setup here
import { afterEach } from 'vitest';
import { Window } from 'happy-dom';

// Create a new window instance
const window = new Window();
const document = window.document;

// Set up globals
Object.defineProperty(globalThis, 'window', { value: window });
Object.defineProperty(globalThis, 'document', { value: document });
Object.defineProperty(globalThis, 'CustomElementRegistry', { value: window.CustomElementRegistry });
Object.defineProperty(globalThis, 'customElements', { value: window.customElements });
Object.defineProperty(globalThis, 'HTMLElement', { value: window.HTMLElement });

// runs a cleanup after each test case
afterEach(() => {
  // Clean up any elements added to the document
  document.body.innerHTML = '';
}); 