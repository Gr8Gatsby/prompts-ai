import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './router.js';

// Helper function to wait for custom element to be defined
const waitForElement = async (element) => {
  return new Promise(resolve => {
    if (element.shadowRoot) {
      resolve();
    } else {
      element.addEventListener('load', () => resolve(), { once: true });
    }
  });
};

describe('app-router', () => {
  let element;

  beforeEach(async () => {
    element = document.createElement('app-router');
    // Add some mock pages
    element.innerHTML = `
      <div data-page="prompts">Prompts</div>
      <div data-page="analytics">Analytics</div>
      <div data-page="testing">Testing</div>
      <div data-page="settings">Settings</div>
    `;
    document.body.appendChild(element);
    await waitForElement(element);
  });

  afterEach(() => {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
    window.location.hash = '';
  });

  it('should render with a slot', () => {
    const slot = element.shadowRoot.querySelector('slot');
    expect(slot).not.toBeNull();
  });

  it('should show prompts page by default', async () => {
    await element.handleRoute();
    const promptsPage = element.querySelector('[data-page="prompts"]');
    expect(promptsPage.hasAttribute('active')).toBe(true);
  });

  it('should update active page when hash changes', async () => {
    window.location.hash = '#testing';
    await element.handleRoute();
    
    const testingPage = element.querySelector('[data-page="testing"]');
    const otherPages = Array.from(element.querySelectorAll('[data-page]:not([data-page="testing"])'));
    
    expect(testingPage.hasAttribute('active')).toBe(true);
    otherPages.forEach(page => {
      expect(page.hasAttribute('active')).toBe(false);
    });
  });

  it('should dispatch pagechange event when route changes', async () => {
    let emittedDetail = null;
    element.addEventListener('pagechange', (e) => {
      emittedDetail = e.detail;
    });

    window.location.hash = '#settings';
    await element.handleRoute();

    expect(emittedDetail).not.toBeNull();
    expect(emittedDetail.page).toBe('settings');
  });

  it('should handle invalid routes gracefully', async () => {
    window.location.hash = '#invalid';
    await element.handleRoute();
    
    // Should default to prompts
    const promptsPage = element.querySelector('[data-page="prompts"]');
    expect(promptsPage.hasAttribute('active')).toBe(true);
  });
}); 