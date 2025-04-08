import '../navigation/navigation.js';
import '../router/router.js';

export class AppShell extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.style.display = 'grid';
    this.style.gridTemplateRows = 'auto 1fr';
    this.style.minHeight = '100vh';
    this.style.backgroundColor = 'var(--background-color, #f5f5f5)';
    this.style.color = 'var(--text-color, #333333)';
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          height: 100%;
          width: 100%;
          display: grid;
          grid-template-rows: auto 1fr;
        }

        header {
          background: #1a1a1a;
          padding: 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        main.main-content {
          padding: 24px;
          width: 100%;
          box-sizing: border-box;
          overflow-y: auto;
        }

        @media (max-width: 767px) {
          main.main-content {
            padding: 16px;
          }
        }

        @media (prefers-color-scheme: dark) {
          header {
            background: #000000;
          }
        }
      </style>
      <header role="banner">
        <app-navigation></app-navigation>
      </header>
      <main role="main" class="main-content">
        <app-router></app-router>
      </main>
    `;
  }
}

customElements.define('app-shell', AppShell);