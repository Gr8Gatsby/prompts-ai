import '../navigation/navigation.js';

class AppShell extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupNavigation();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          height: 100%;
          width: 100%;
        }

        header {
          background: #1a1a1a;
          padding: 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        main {
          display: block;
          padding: 24px;
          box-sizing: border-box;
          min-height: calc(100vh - 44px);
          background: var(--main-bg, #ffffff);
        }

        section {
          display: none;
        }

        section[aria-current="page"] {
          display: block;
        }

        h1 {
          margin: 0 0 24px 0;
          font-size: 24px;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--text-color, #000000);
        }

        @media (max-width: 767px) {
          main {
            padding: 16px;
          }

          h1 {
            font-size: 20px;
            margin-bottom: 16px;
          }
        }

        @media (prefers-color-scheme: dark) {
          :host {
            --main-bg: #1c1c1e;
            --text-color: #ffffff;
          }

          header {
            background: #000000;
          }
        }
      </style>

      <header role="banner">
        <app-navigation></app-navigation>
      </header>

      <main role="main">
        <section id="prompts" aria-labelledby="prompts-heading" aria-current="page">
          <h1 id="prompts-heading">Prompt Management</h1>
          <prompt-editor></prompt-editor>
        </section>
        
        <section id="analytics" aria-labelledby="analytics-heading">
          <h1 id="analytics-heading">Analytics Dashboard</h1>
          <analytics-dashboard></analytics-dashboard>
        </section>
        
        <section id="testing" aria-labelledby="testing-heading">
          <h1 id="testing-heading">Prompt Testing</h1>
          <testing-interface></testing-interface>
        </section>
        
        <section id="settings" aria-labelledby="settings-heading">
          <h1 id="settings-heading">Settings</h1>
          <settings-panel></settings-panel>
        </section>
      </main>
    `;
  }

  setupNavigation() {
    this.addEventListener('navigation', (e) => {
      const page = e.detail.page;
      const sections = this.shadowRoot.querySelectorAll('section');
      
      sections.forEach(section => {
        if (section.id === page) {
          section.setAttribute('aria-current', 'page');
          document.title = `Prompts AI - ${page.charAt(0).toUpperCase() + page.slice(1)}`;
        } else {
          section.removeAttribute('aria-current');
        }
      });
    });
  }
}

// Only define the custom element if it hasn't been defined yet
if (!customElements.get('app-shell')) {
  customElements.define('app-shell', AppShell);
}