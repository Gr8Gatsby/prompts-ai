import { BaseComponent } from '../base-component.js';

export class TestingInterface extends BaseComponent {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: var(--spacing-lg);
        }

        .placeholder {
          color: var(--text-secondary);
          text-align: center;
          padding: var(--spacing-xl);
          background: var(--surface-overlay);
          border-radius: var(--border-radius-lg);
        }
      </style>

      <div class="placeholder">
        Testing Interface - Coming Soon
      </div>
    `;
  }
}

customElements.define('testing-interface', TestingInterface); 