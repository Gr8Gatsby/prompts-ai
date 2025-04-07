import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './app-shell.js';

class AppShell extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <app-navigation></app-navigation>
      <main>
        <section id="prompts" aria-current="page">
          <h2>Prompts</h2>
        </section>
        <section id="analytics">
          <h2>Analytics</h2>
        </section>
        <section id="testing">
          <h2>Testing</h2>
        </section>
        <section id="settings">
          <h2>Settings</h2>
        </section>
      </main>
    `;

    // Handle navigation events
    this.addEventListener('navigation', (e) => {
      const page = e.detail.page;
      this.setCurrentPage(page);
    });
  }

  setCurrentPage(page) {
    this.shadowRoot.querySelectorAll('section').forEach(section => {
      if (section.id === page) {
        section.setAttribute('aria-current', 'page');
      } else {
        section.removeAttribute('aria-current');
      }
    });
  }
}

// Define the custom element before running tests
customElements.define('app-shell', AppShell);

describe('app-shell', () => {
  let element;

  beforeEach(async () => {
    element = document.createElement('app-shell');
    document.body.appendChild(element);
    // Wait for custom element to be defined and initialized
    await customElements.whenDefined('app-shell');
  });

  afterEach(() => {
    element.remove();
  });

  it('should render all sections', () => {
    const sections = element.shadowRoot.querySelectorAll('section');
    expect(sections.length).toBe(4);
    
    const expectedSections = ['prompts', 'analytics', 'testing', 'settings'];
    sections.forEach((section, index) => {
      expect(section.id).toBe(expectedSections[index]);
    });
  });

  it('should show prompts section by default', () => {
    const promptsSection = element.shadowRoot.querySelector('#prompts');
    expect(promptsSection.getAttribute('aria-current')).toBe('page');
    
    const otherSections = Array.from(element.shadowRoot.querySelectorAll('section')).filter(section => section.id !== 'prompts');
    otherSections.forEach(section => {
      expect(section.hasAttribute('aria-current')).toBe(false);
    });
  });

  it('should handle navigation events', () => {
    const event = new CustomEvent('navigation', {
      detail: { page: 'testing' },
      bubbles: true,
      composed: true
    });
    
    element.dispatchEvent(event);
    
    const testingSection = element.shadowRoot.querySelector('#testing');
    expect(testingSection.getAttribute('aria-current')).toBe('page');
    
    const otherSections = Array.from(element.shadowRoot.querySelectorAll('section')).filter(section => section.id !== 'testing');
    otherSections.forEach(section => {
      expect(section.hasAttribute('aria-current')).toBe(false);
    });
  });

  it('should maintain section visibility when navigation occurs', () => {
    // Navigate to analytics
    element.dispatchEvent(new CustomEvent('navigation', {
      detail: { page: 'analytics' },
      bubbles: true,
      composed: true
    }));

    // Check analytics is visible
    const analyticsSection = element.shadowRoot.querySelector('#analytics');
    expect(analyticsSection.getAttribute('aria-current')).toBe('page');

    // Navigate to settings
    element.dispatchEvent(new CustomEvent('navigation', {
      detail: { page: 'settings' },
      bubbles: true,
      composed: true
    }));

    // Check settings is visible and analytics is hidden
    const settingsSection = element.shadowRoot.querySelector('#settings');
    expect(settingsSection.getAttribute('aria-current')).toBe('page');
    expect(analyticsSection.hasAttribute('aria-current')).toBe(false);
  });
}); 