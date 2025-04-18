import '../navigation/navigation.js';
import '../prompt-list/prompt-list.js';
import '../prompt-editor/prompt-editor.js';
import '../settings-panel/settings-panel.js';

export class AppShell extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentPath = window.location.pathname || '/prompts';
    this.setupTheme();
    this.render();
    this.setupEventListeners();
  }

  setupTheme() {
    // Check for dark mode preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');

    // Set initial font size from localStorage or default to medium
    const savedFontSize = localStorage.getItem('font-size') || 'medium';
    document.documentElement.setAttribute('data-font-size', savedFontSize);

    // Listen for theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    });

    // Listen for font size changes
    window.addEventListener('font-size-changed', (e) => {
      const newSize = e.detail.size;
      document.documentElement.setAttribute('data-font-size', newSize);
      localStorage.setItem('font-size', newSize);
    });
  }

  setupEventListeners() {
    // Listen for route changes
    window.addEventListener('route-changed', (e) => {
      this.currentPath = e.detail.path;
      this.updateVisibleSection();
    });
  }

  updateVisibleSection() {
    const sections = this.shadowRoot.querySelectorAll('section');
    sections.forEach(section => {
      section.setAttribute('aria-current', 'false');
      section.style.display = 'none';
    });

    let currentSection;
    switch (this.currentPath) {
      case '/prompts':
        currentSection = this.shadowRoot.querySelector('#prompts');
        break;
      case '/editor':
        currentSection = this.shadowRoot.querySelector('#editor');
        break;
      case '/analytics':
        currentSection = this.shadowRoot.querySelector('#analytics');
        break;
      case '/testing':
        currentSection = this.shadowRoot.querySelector('#testing');
        break;
      case '/settings':
        currentSection = this.shadowRoot.querySelector('#settings');
        break;
      default:
        currentSection = this.shadowRoot.querySelector('#prompts');
    }

    if (currentSection) {
      currentSection.setAttribute('aria-current', 'page');
      currentSection.style.display = 'block';
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          height: 100vh;
          width: 100%;
          display: grid;
          grid-template-rows: var(--header-height) 1fr;
          background: var(--primary-background);
          color: var(--text-primary);
        }

        header {
          background: var(--secondary-background);
          padding: 0;
          position: sticky;
          top: 0;
          z-index: var(--z-index-sticky);
          border-bottom: 1px solid var(--border-color);
        }

        main {
          padding: var(--spacing-lg);
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          overflow: hidden;
          background: var(--primary-background);
        }

        section {
          display: none;
          height: 100%;
        }

        section[aria-current="page"] {
          display: block;
          height: 100%;
        }

        h1 {
          margin: 0 0 var(--spacing-lg) 0;
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-semibold);
          letter-spacing: -0.01em;
          color: var(--text-primary);
        }

        @media (max-width: 767px) {
          main {
            padding: var(--spacing-md);
          }

          h1 {
            font-size: var(--font-size-lg);
            margin-bottom: var(--spacing-md);
          }
        }
      </style>

      <header role="banner">
        <app-navigation></app-navigation>
      </header>

      <main role="main">
        <section id="prompts" aria-labelledby="prompts-heading" aria-current="page">
          <prompt-list></prompt-list>
        </section>

        <section id="editor" aria-labelledby="editor-heading">
          <prompt-editor></prompt-editor>
        </section>

        <section id="analytics" aria-labelledby="analytics-heading">
          <analytics-dashboard></analytics-dashboard>
        </section>

        <section id="testing" aria-labelledby="testing-heading">
          <testing-interface></testing-interface>
        </section>

        <section id="settings" aria-labelledby="settings-heading">
          <settings-panel></settings-panel>
        </section>
      </main>
    `;

    // Set initial section visibility
    this.updateVisibleSection();
  }
}

customElements.define('app-shell', AppShell);