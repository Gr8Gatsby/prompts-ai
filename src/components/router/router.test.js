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

describe('app-router', () => {
  let element;
  let mockLocation;

  beforeEach(async () => {
    // Mock window.location
    mockLocation = { 
      pathname: '/',
      search: '' 
    };
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
      configurable: true
    });

    // Mock window.history
    window.history.pushState = vi.fn().mockImplementation((state, title, url) => {
      const [pathname, search] = url.split('?');
      mockLocation.pathname = pathname;
      mockLocation.search = search ? `?${search}` : '';
    });

    element = document.createElement('app-router');
    document.body.appendChild(element);
    await waitForElement(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
    vi.restoreAllMocks();
  });

  it('should render with a router outlet', () => {
    const outlet = element.shadowRoot.querySelector('.router-outlet');
    expect(outlet).not.toBeNull();
    expect(outlet.querySelector('.content')).not.toBeNull();
    expect(outlet.querySelector('h1')).not.toBeNull();
  });

  it('should show prompts page by default', () => {
    const content = element.shadowRoot.querySelector('.content');
    const title = element.shadowRoot.querySelector('h1');
    
    expect(content.firstElementChild.tagName.toLowerCase()).toBe('prompt-list');
    expect(title.textContent).toBe('Prompt Management');
    expect(document.title).toBe('Prompts AI - Prompt Management');
  });

  it('should navigate to editor when create-prompt event is dispatched', async () => {
    document.dispatchEvent(new CustomEvent('create-prompt'));
    
    // Wait for DOM updates
    await waitForDomUpdate();
    
    const content = element.shadowRoot.querySelector('.content');
    const editor = content.firstElementChild;
    const title = element.shadowRoot.querySelector('h1');
    
    expect(editor.tagName.toLowerCase()).toBe('prompt-editor');
    expect(title.textContent).toBe('Create Prompt');
    expect(window.history.pushState).toHaveBeenCalledWith({}, '', '/editor');
  });

  it('should navigate to editor with prompt ID when edit-prompt event is dispatched', async () => {
    // Dispatch the edit-prompt event
    document.dispatchEvent(new CustomEvent('edit-prompt', {
      detail: { promptId: '123' }
    }));
    
    // Wait for DOM updates
    await waitForDomUpdate();
    
    // Get the current state
    const content = element.shadowRoot.querySelector('.content');
    const editor = content.firstElementChild;
    const title = element.shadowRoot.querySelector('h1');
    
    // Verify the editor was created with the correct ID
    expect(editor.tagName.toLowerCase()).toBe('prompt-editor');
    expect(editor.getAttribute('prompt-id')).toBe('123');
    expect(title.textContent).toBe('Edit Prompt');
    expect(window.history.pushState).toHaveBeenCalledWith({}, '', '/editor?id=123');
  });

  it('should navigate back to prompts when save-prompt event is dispatched', async () => {
    // First navigate to editor
    mockLocation.pathname = '/editor';
    element.handleRouteChange();
    
    document.dispatchEvent(new CustomEvent('save-prompt'));
    
    // Wait for DOM updates
    await waitForDomUpdate();
    
    const content = element.shadowRoot.querySelector('.content');
    const list = content.firstElementChild;
    const title = element.shadowRoot.querySelector('h1');
    
    expect(list.tagName.toLowerCase()).toBe('prompt-list');
    expect(title.textContent).toBe('Prompt Management');
    expect(window.history.pushState).toHaveBeenCalledWith({}, '', '/prompts');
  });

  it('should navigate back to prompts when cancel-edit event is dispatched', async () => {
    // First navigate to editor
    mockLocation.pathname = '/editor';
    element.handleRouteChange();
    
    document.dispatchEvent(new CustomEvent('cancel-edit'));
    
    // Wait for DOM updates
    await waitForDomUpdate();
    
    const content = element.shadowRoot.querySelector('.content');
    const list = content.firstElementChild;
    const title = element.shadowRoot.querySelector('h1');
    
    expect(list.tagName.toLowerCase()).toBe('prompt-list');
    expect(title.textContent).toBe('Prompt Management');
    expect(window.history.pushState).toHaveBeenCalledWith({}, '', '/prompts');
  });

  it('should handle popstate events', async () => {
    // Mock location change
    mockLocation.pathname = '/analytics';
    
    // Dispatch popstate event
    window.dispatchEvent(new PopStateEvent('popstate'));
    
    // Wait for DOM updates
    await waitForDomUpdate();
    
    const content = element.shadowRoot.querySelector('.content');
    const title = element.shadowRoot.querySelector('h1');
    
    expect(content.innerHTML).toContain('Analytics Dashboard coming soon');
    expect(title.textContent).toBe('Analytics Dashboard');
  });
}); 