import '../navigation/navigation.js';
import '../router/router.js';

class AppShell extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
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

        @media (max-width: 767px) {
          main {
            padding: 16px;
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
        <app-router></app-router>
      </main>
    `;
  }
}

// Only define the custom element if it hasn't been defined yet
if (!customElements.get('app-shell')) {
  customElements.define('app-shell', AppShell);
}