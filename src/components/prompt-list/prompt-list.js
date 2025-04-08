import { StorageService } from '../../services/storage.js';
import { BaseComponent } from '../base-component.js';

export class PromptList extends BaseComponent {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.prompts = [];
    this.storageService = new StorageService();
  }

  connectedCallback() {
    this.render();
    this.loadPrompts();
    this.setupEventListeners();

    // Listen for prompt updates
    document.addEventListener('prompt-saved', () => {
      this.loadPrompts();
    });
  }

  disconnectedCallback() {
    document.removeEventListener('prompt-saved', () => {
      this.loadPrompts();
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }

        .prompt-list {
          max-width: var(--content-width);
          margin: 0 auto;
        }

        .header {
          display: flex;
          justify-content: flex-end;
          margin-bottom: var(--spacing-lg);
        }

        .create-button {
          background: var(--button-primary-bg);
          color: var(--text-primary);
          height: 44px;
          padding: 0 24px;
          border-radius: 12px;
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          white-space: nowrap;
          text-decoration: none;
          min-width: 120px;
          letter-spacing: 0.01em;
          border: none;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .create-button:hover {
          background: var(--button-primary-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .create-button:active {
          background: var(--button-primary-active);
          transform: translateY(0);
          box-shadow: var(--shadow-sm);
        }

        .prompts {
          display: grid;
          gap: var(--spacing-md);
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        }

        .prompt-card {
          background: var(--card-background);
          border-radius: var(--card-border-radius);
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid var(--border-color);
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .prompt-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          border-color: var(--border-color);
        }
        
        .prompt-title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          margin-bottom: 12px;
          color: var(--text-primary);
        }
        
        .prompt-preview {
          font-size: var(--font-size-sm);
          margin-bottom: 16px;
          color: var(--text-secondary);
          line-height: var(--line-height-normal);
          flex-grow: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .prompt-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: auto;
        }
        
        .tag {
          background: var(--button-secondary-bg);
          color: var(--text-primary);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-medium);
        }

        @media (max-width: 767px) {
          .header {
            margin-bottom: var(--spacing-md);
          }
        }
      </style>

      <div class="prompt-list">
        <div class="header">
          <button class="create-button">Create New Prompt</button>
        </div>
        <div class="prompts">
          ${this.renderPrompts()}
        </div>
      </div>
    `;
  }

  renderPrompts() {
    if (this.prompts === null) {
      return this.renderError();
    } else if (this.prompts.length === 0) {
      return this.renderEmptyState();
    } else {
      return this.prompts.map(prompt => this.renderPromptCard(prompt)).join('');
    }
  }

  renderError() {
    return `
      <div class="error-message">
        <p>Failed to load prompts. Please try again later.</p>
      </div>
    `;
  }

  renderEmptyState() {
    return `
      <div style="grid-column: 1 / -1; text-align: center; padding: 32px; color: var(--secondary-text-color, #666);">
        <p>No prompts yet. Click "Create New Prompt" to get started.</p>
      </div>
    `;
  }

  renderPromptCard(prompt) {
    return `
      <div class="prompt-card" data-id="${prompt.id}">
        <div class="prompt-title">${this.escapeHtml(prompt.title)}</div>
        <div class="prompt-preview">${this.escapeHtml(prompt.content)}</div>
        <div class="prompt-tags">
          ${prompt.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
        </div>
      </div>
    `;
  }

  escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
      .toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  setupEventListeners() {
    const createButton = this.shadowRoot.querySelector('.create-button');
    createButton.addEventListener('click', () => {
      window.history.pushState({}, '', '/editor');
      window.dispatchEvent(new CustomEvent('route-changed', {
        detail: { path: '/editor' }
      }));
    });

    this.shadowRoot.querySelectorAll('.prompt-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const promptId = e.currentTarget.dataset.id;
        window.history.pushState({}, '', `/editor?id=${promptId}`);
        window.dispatchEvent(new CustomEvent('route-changed', {
          detail: { path: `/editor?id=${promptId}` }
        }));
      });
    });
  }

  async loadPrompts() {
    try {
      this.prompts = await this.storageService.getAllPrompts();
      this.render();
      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to load prompts:', error);
      this.prompts = null;
      this.render();
    }
  }
}

customElements.define('prompt-list', PromptList); 