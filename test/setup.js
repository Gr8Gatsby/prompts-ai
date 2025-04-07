// Add any global test setup here
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/dom';

// runs a cleanup after each test case
afterEach(() => {
  cleanup();
}); 