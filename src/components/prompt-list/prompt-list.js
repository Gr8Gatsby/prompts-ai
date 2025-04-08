import { StorageService } from '../../services/storage.js';

class PromptList extends HTMLElement {
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
          background: var(--primary-color);
          color: var(--text-on-primary);
          border: none;
          padding: var(--spacing-md) var(--spacing-lg);
          border-radius: var(--border-radius-md);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
          transition: background-color var(--transition-normal);
        }

        .create-button:hover {
          background: var(--primary-color-hover);
        }

        .prompts {
          display: grid;
          gap: var(--spacing-md);
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
      window.history.pushState({}, '', '/prompts/new');
      window.dispatchEvent(new CustomEvent('route-changed', {
        detail: { path: '/prompts/new' }
      }));
    });

    this.shadowRoot.querySelectorAll('.prompt-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const promptId = e.currentTarget.dataset.id;
        document.dispatchEvent(new CustomEvent('edit-prompt', {
          detail: { promptId },
          bubbles: true,
          composed: true
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