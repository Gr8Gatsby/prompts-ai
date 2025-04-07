import { beforeEach, describe, expect, it, vi } from 'vitest';

// Import the components before testing
import '../navigation/navigation.js';
import '../router/router.js';
import './app-shell.js';

// Helper function to wait for element to be ready
const waitForElement = async (element) => {
  return new Promise(resolve => {
    if (element.shadowRoot) {
      resolve();
    } else {
      element.addEventListener('load', () => resolve(), { once: true });
    }
  });
};

describe('app-shell', () => {
  let element;

  beforeEach(async () => {
    // Wait for custom elements to be defined
    await Promise.all([
      customElements.whenDefined('app-shell'),
      customElements.whenDefined('app-navigation'),
      customElements.whenDefined('app-router')
    ]);

    element = document.createElement('app-shell');
    document.body.appendChild(element);
    await waitForElement(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should render navigation and router', () => {
    const navigation = element.shadowRoot.querySelector('app-navigation');
    const router = element.shadowRoot.querySelector('app-router');
    
    expect(navigation).not.toBeNull();
    expect(router).not.toBeNull();
  });

  it('should render header and main sections', () => {
    const header = element.shadowRoot.querySelector('header');
    const main = element.shadowRoot.querySelector('main');
    
    expect(header).not.toBeNull();
    expect(main).not.toBeNull();
    expect(header.getAttribute('role')).toBe('banner');
    expect(main.getAttribute('role')).toBe('main');
  });

  it('should apply dark mode styles when preferred', async () => {
    // Mock prefers-color-scheme media query
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));

    // Create new element to test dark mode
    const darkElement = document.createElement('app-shell');
    document.body.appendChild(darkElement);
    await waitForElement(darkElement);

    const header = darkElement.shadowRoot.querySelector('header');
    const computedStyle = getComputedStyle(header);
    
    expect(computedStyle.backgroundColor).toBe('#1a1a1a');

    document.body.removeChild(darkElement);
  });

  it('should apply mobile styles when viewport is small', async () => {
    // Mock mobile viewport
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(max-width: 767px)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));

    // Create new element to test mobile styles
    const mobileElement = document.createElement('app-shell');
    document.body.appendChild(mobileElement);
    await waitForElement(mobileElement);

    const main = mobileElement.shadowRoot.querySelector('main');
    const computedStyle = getComputedStyle(main);
    
    expect(computedStyle.padding).toBe('24px');

    document.body.removeChild(mobileElement);
  });
}); 