import '../navigation/navigation.js';
import '../prompt-list/prompt-list.js';
import '../prompt-editor/prompt-editor.js';

export class AppShell extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentPath = window.location.pathname || '/prompts';
    this.render();
    this.setupEventListeners();
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
    if (this.currentPath === '/prompts') {
      currentSection = this.shadowRoot.querySelector('#prompts-list');
    } else if (this.currentPath === '/prompts/new') {
      currentSection = this.shadowRoot.querySelector('#prompt-editor');
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
          height: 100%;
          width: 100%;
          display: grid;
          grid-template-rows: var(--header-height) 1fr;
          background: #121212;
          color: #ffffff;
        }

        header {
          background: #1a1a1a;
          padding: 0;
          position: sticky;
          top: 0;
          z-index: var(--z-index-sticky);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        main {
          padding: var(--spacing-lg);
          width: 100%;
          box-sizing: border-box;
          overflow-y: auto;
          background: #121212;
        }

        section {
          display: none;
          height: 100%;
        }

        section[aria-current="page"] {
          display: block;
        }

        h1 {
          margin: 0 0 var(--spacing-lg) 0;
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-semibold);
          letter-spacing: -0.01em;
          color: rgba(255, 255, 255, 0.95);
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
        <section id="prompts-list" aria-labelledby="prompts-heading" aria-current="page">
          <prompt-list></prompt-list>
        </section>

        <section id="prompt-editor" aria-labelledby="new-prompt-heading">
          <prompt-editor></prompt-editor>
        </section>
      </main>
    `;

    // Set initial section visibility
    this.updateVisibleSection();
  }
}

customElements.define('app-shell', AppShell);