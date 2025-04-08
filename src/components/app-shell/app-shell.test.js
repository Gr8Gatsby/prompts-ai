import { beforeEach, describe, expect, it, vi } from 'vitest';

// Import the components before testing
import '../navigation/navigation.js';
import '../router/router.js';
import './app-shell.js';

// Set test environment
process.env.NODE_ENV = 'test';

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
  let originalMatchMedia;

  beforeEach(async () => {
    // Mock matchMedia
    originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation(query => {
      const matches = query === '(prefers-color-scheme: dark)' || query === '(max-width: 767px)';
      return {
        matches,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      };
    });

    // Wait for custom elements to be defined
    await Promise.all([
      customElements.whenDefined('app-shell'),
      customElements.whenDefined('app-navigation'),
      customElements.whenDefined('app-router')
    ]);

    element = document.createElement('app-shell');
    document.body.appendChild(element);
    // Wait for custom element to be ready
    await new Promise(resolve => requestAnimationFrame(resolve));
  });

  afterEach(() => {
    document.body.removeChild(element);
    window.matchMedia = originalMatchMedia;
  });

  it('should render with navigation and router components', () => {
    const navigation = element.shadowRoot.querySelector('app-navigation');
    const router = element.shadowRoot.querySelector('app-router');
    
    expect(navigation).toBeTruthy();
    expect(router).toBeTruthy();
  });

  it('should have a main content area', () => {
    const main = element.shadowRoot.querySelector('main');
    expect(main).toBeTruthy();
    expect(main.classList.contains('main-content')).toBe(true);
  });

  it('should have a responsive layout', () => {
    const style = window.getComputedStyle(element.shadowRoot.host);
    expect(style.display).toBe('grid');
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
    const originalMatchMedia = window.matchMedia;
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

    // Force a reflow to ensure styles are applied
    darkElement.offsetHeight;

    const header = darkElement.shadowRoot.querySelector('header');
    const computedStyle = getComputedStyle(header);
    
    expect(computedStyle.backgroundColor).toBe('#1a1a1a');

    document.body.removeChild(darkElement);
    window.matchMedia = originalMatchMedia;
  });

  it('should apply mobile styles when viewport is small', async () => {
    // Mock mobile viewport
    const originalMatchMedia = window.matchMedia;
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

    // Force a reflow to ensure styles are applied
    mobileElement.offsetHeight;

    const main = mobileElement.shadowRoot.querySelector('main');
    const computedStyle = getComputedStyle(main);
    
    expect(computedStyle.padding).toBe('24px');

    document.body.removeChild(mobileElement);
    window.matchMedia = originalMatchMedia;
  });
}); 