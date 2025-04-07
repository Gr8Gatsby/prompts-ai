// Add any global test setup here
import { afterEach } from 'vitest';

// runs a cleanup after each test case
afterEach(() => {
  // Clean up any elements added to the document
  document.body.innerHTML = '';
}); 