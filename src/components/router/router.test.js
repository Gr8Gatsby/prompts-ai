import { beforeEach, describe, expect, it, vi } from 'vitest';
import './router.js';

// Mock custom elements only if they haven't been defined yet
if (!customElements.get('prompt-list')) {
  customElements.define('prompt-list', class extends HTMLElement {});
}
if (!customElements.get('prompt-editor')) {
  customElements.define('prompt-editor', class extends HTMLElement {});
}
if (!customElements.get('analytics-dashboard')) {
  customElements.define('analytics-dashboard', class extends HTMLElement {});
}
if (!customElements.get('testing-interface')) {
  customElements.define('testing-interface', class extends HTMLElement {});
}
if (!customElements.get('settings-panel')) {
  customElements.define('settings-panel', class extends HTMLElement {});
}

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

// Helper function to wait for DOM updates
const waitForDomUpdate = () => new Promise(resolve => setTimeout(resolve, 0));

// Set test environment
process.env.NODE_ENV = 'test';

describe('app-router', () => {
  let element;

  beforeEach(async () => {
    // Reset location
    window.history.pushState({}, '', '/');
    
    element = document.createElement('app-router');
    document.body.appendChild(element);
    // Wait for custom element to be ready
    await new Promise(resolve => requestAnimationFrame(resolve));
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should render with a router outlet', () => {
    const outlet = element.shadowRoot.querySelector('.content');
    expect(outlet).toBeTruthy();
  });

  it('should show prompts page by default', () => {
    const title = element.shadowRoot.querySelector('h1');
    expect(title.textContent).toBe('Prompt Management');
    expect(element.shadowRoot.querySelector('prompt-list')).toBeTruthy();
  });

  it('should navigate back to prompts when save-prompt event is dispatched', () => {
    // First navigate to editor
    document.dispatchEvent(new CustomEvent('create-prompt'));
    
    // Then save
    document.dispatchEvent(new CustomEvent('save-prompt'));
    
    const title = element.shadowRoot.querySelector('h1');
    expect(title.textContent).toBe('Prompt Management');
    expect(element.shadowRoot.querySelector('prompt-list')).toBeTruthy();
  });

  it('should navigate back to prompts when cancel-edit event is dispatched', () => {
    // First navigate to editor
    document.dispatchEvent(new CustomEvent('create-prompt'));
    
    // Then cancel
    document.dispatchEvent(new CustomEvent('cancel-edit'));
    
    const title = element.shadowRoot.querySelector('h1');
    expect(title.textContent).toBe('Prompt Management');
    expect(element.shadowRoot.querySelector('prompt-list')).toBeTruthy();
  });

  it('should handle popstate events', () => {
    // Navigate to editor
    document.dispatchEvent(new CustomEvent('create-prompt'));
    
    // Go back
    window.history.back();
    
    const title = element.shadowRoot.querySelector('h1');
    expect(title.textContent).toBe('Prompt Management');
    expect(element.shadowRoot.querySelector('prompt-list')).toBeTruthy();
  });
}); 