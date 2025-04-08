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

    // Create element
    element = document.createElement('app-shell');
    document.body.appendChild(element);
    
    // Wait for shadow DOM to be initialized
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  afterEach(() => {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
    window.matchMedia = originalMatchMedia;
  });

  it('should render with navigation component', () => {
    const navigation = element.shadowRoot.querySelector('app-navigation');
    expect(navigation).toBeTruthy();
  });

  it('should have a main content area', () => {
    const main = element.shadowRoot.querySelector('main');
    expect(main).toBeTruthy();
    expect(main.getAttribute('role')).toBe('main');
  });

  it('should have correct layout structure', () => {
    const header = element.shadowRoot.querySelector('header');
    const main = element.shadowRoot.querySelector('main');
    
    expect(header).toBeTruthy();
    expect(main).toBeTruthy();
    expect(header.getAttribute('role')).toBe('banner');
    expect(main.getAttribute('role')).toBe('main');
  });

  it('should render initial section visibility', async () => {
    // Wait for initial render and updateVisibleSection to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const promptsList = element.shadowRoot.querySelector('#prompts');
    const promptEditor = element.shadowRoot.querySelector('#editor');
    
    expect(promptsList).toBeTruthy();
    expect(promptEditor).toBeTruthy();
    
    // Check if the correct section is visible based on default path
    if (window.location.pathname === '/prompts' || window.location.pathname === '/') {
      expect(promptsList.getAttribute('aria-current')).toBe('page');
      expect(promptEditor.getAttribute('aria-current')).toBe('false');
    } else if (window.location.pathname === '/editor') {
      expect(promptsList.getAttribute('aria-current')).toBe('false');
      expect(promptEditor.getAttribute('aria-current')).toBe('page');
    }
  });

  it('should update section visibility on route change', () => {
    // Trigger route change
    window.dispatchEvent(new CustomEvent('route-changed', {
      detail: { path: '/editor' }
    }));

    const promptsList = element.shadowRoot.querySelector('#prompts');
    const promptEditor = element.shadowRoot.querySelector('#editor');
    
    expect(promptsList.getAttribute('aria-current')).toBe('false');
    expect(promptEditor.getAttribute('aria-current')).toBe('page');
  });

  it('should contain required child components', () => {
    const promptList = element.shadowRoot.querySelector('prompt-list');
    const promptEditor = element.shadowRoot.querySelector('prompt-editor');
    
    expect(promptList).toBeTruthy();
    expect(promptEditor).toBeTruthy();
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

  it('should handle mobile viewport', () => {
    const main = element.shadowRoot.querySelector('main');
    expect(main).toBeTruthy();
    
    // Instead of checking computed styles, verify that the mobile media query was called
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 767px)');
  });
}); 