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
          height: 100%;
          background: var(--background-color, #f5f5f5);
          color: var(--text-color, #333333);
        }

        .container {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: var(--text-color, #333333);
        }

        .create-button {
          background-color: var(--accent-color, #007aff);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }

        .create-button:hover {
          background-color: var(--accent-hover-color, #0062cc);
        }

        .prompts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .prompt-card {
          background: var(--card-background, white);
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .prompt-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .prompt-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-color, #333);
        }

        .prompt-preview {
          font-size: 14px;
          color: var(--secondary-text-color, #666);
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .prompt-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag {
          background: var(--tag-background, #f0f0f0);
          color: var(--tag-text-color, #666);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        @media (prefers-color-scheme: dark) {
          :host {
            --background-color: #1c1c1e;
            --text-color: #ffffff;
            --card-background: #2c2c2e;
            --secondary-text-color: #8e8e93;
          }
        }

        @media (max-width: 767px) {
          .container {
            padding: 16px;
          }
        }

        .error-message {
          grid-column: 1 / -1;
          text-align: center;
          padding: 32px;
          color: var(--error-color, #ff3b30);
        }
      </style>

      <div class="container">
        <div class="header">
          <h2>Prompts</h2>
          <button class="create-button">Create New Prompt</button>
        </div>
        <div class="prompts-grid">
          ${this.prompts === null ? this.renderError() :
            this.prompts.length === 0 ? this.renderEmptyState() :
            this.prompts.map(prompt => this.renderPromptCard(prompt)).join('')}
        </div>
      </div>
    `;
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
    this.shadowRoot.querySelector('.create-button').addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('create-prompt', {
        bubbles: true,
        composed: true
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