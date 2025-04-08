import { StorageService } from '../../services/storage.js';
import { BaseComponent } from '../base-component.js';

export class PromptList extends BaseComponent {
  constructor() {
    super();
    const shadowRoot = this.attachShadowAndInjectStyles();
    this.prompts = [];
    this.storageService = new StorageService();
    this.promptToDelete = null;
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
          padding: 0 var(--spacing-md);
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
          gap: var(--spacing-lg);
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        }

        .prompt-card {
          background: var(--card-background);
          border-radius: var(--card-border-radius);
          padding: var(--spacing-lg);
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid var(--border-color);
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        
        .prompt-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          border-color: var(--border-color);
        }

        .prompt-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-md);
        }
        
        .prompt-title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
          flex: 1;
          margin-right: var(--spacing-sm);
        }

        .delete-button {
          background: transparent;
          border: none;
          color: var(--text-tertiary);
          cursor: pointer;
          padding: var(--spacing-xs);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .delete-button:hover {
          color: var(--accent-error);
          background: var(--hover-overlay);
        }
        
        .prompt-preview {
          font-size: var(--font-size-sm);
          margin-bottom: var(--spacing-md);
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
          gap: var(--spacing-xs);
          margin-top: auto;
        }
        
        .tag {
          background: var(--button-secondary-bg);
          color: var(--text-primary);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--border-radius-sm);
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-medium);
        }

        /* Modal styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: var(--z-index-modal);
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
        }

        .modal-overlay.visible {
          opacity: 1;
          visibility: visible;
        }

        .modal {
          background: var(--card-background);
          border-radius: var(--card-border-radius);
          padding: var(--spacing-lg);
          width: 90%;
          max-width: 400px;
          transform: translateY(20px);
          transition: all 0.2s ease;
        }

        .modal-overlay.visible .modal {
          transform: translateY(0);
        }

        .modal-title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--spacing-md);
          color: var(--text-primary);
        }

        .modal-content {
          font-size: var(--font-size-md);
          color: var(--text-secondary);
          margin-bottom: var(--spacing-lg);
          line-height: var(--line-height-normal);
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--spacing-md);
        }

        .modal-cancel {
          background: var(--button-secondary-bg);
          color: var(--text-primary);
          border: 1px solid var(--button-secondary-border);
        }

        .modal-confirm {
          background: var(--accent-error);
          color: white;
        }

        .modal-cancel,
        .modal-confirm {
          padding: var(--spacing-sm) var(--spacing-lg);
          border-radius: var(--border-radius-md);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-cancel:hover {
          background: var(--button-secondary-hover);
        }

        .modal-confirm:hover {
          opacity: 0.9;
        }

        @media (max-width: 767px) {
          .header {
            margin-bottom: var(--spacing-md);
          }
          
          .prompts {
            gap: var(--spacing-md);
          }
        }

        .error-message {
          background: var(--accent-error);
          color: white;
          padding: var(--spacing-md);
          border-radius: var(--border-radius-md);
          margin-bottom: var(--spacing-lg);
          text-align: center;
        }
      </style>

      <div class="prompt-list">
        ${this.prompts === null ? this.renderError() : ''}
        <div class="header">
          <button class="create-button">Create New Prompt</button>
        </div>
        <div class="prompts">
          ${this.renderPrompts()}
        </div>
      </div>

      <div class="modal-overlay">
        <div class="modal">
          <div class="modal-title">Delete Prompt</div>
          <div class="modal-content">
            Are you sure you want to delete this prompt? This action cannot be undone.
          </div>
          <div class="modal-actions">
            <button class="modal-cancel">Cancel</button>
            <button class="modal-confirm">Delete</button>
          </div>
        </div>
      </div>
    `;
  }

  renderPrompts() {
    if (this.prompts === null) {
      return '';
    } else if (this.prompts.length === 0) {
      return this.renderEmptyState();
    } else {
      return this.prompts.map(prompt => this.renderPromptCard(prompt)).join('');
    }
  }

  renderError() {
    return `
      <div class="error-message">
        Failed to load prompts. Please try again later.
      </div>
    `;
  }

  renderEmptyState() {
    return `
      <div style="grid-column: 1 / -1; text-align: center; padding: var(--spacing-xl); color: var(--text-tertiary);">
        <p>No prompts yet. Click "Create New Prompt" to get started.</p>
      </div>
    `;
  }

  renderPromptCard(prompt) {
    return `
      <div class="prompt-card" data-id="${prompt.id}">
        <div class="prompt-card-header">
          <div class="prompt-title">${this.escapeHtml(prompt.title)}</div>
          <button class="delete-button" data-id="${prompt.id}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
            </svg>
          </button>
        </div>
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

  showDeleteModal(promptId) {
    this.promptToDelete = promptId;
    const modal = this.shadowRoot.querySelector('.modal-overlay');
    modal.classList.add('visible');
  }

  hideDeleteModal() {
    this.promptToDelete = null;
    const modal = this.shadowRoot.querySelector('.modal-overlay');
    modal.classList.remove('visible');
  }

  async deletePrompt(promptId) {
    try {
      const numericId = Number(promptId);
      if (isNaN(numericId)) {
        throw new Error('Invalid prompt ID');
      }
      
      await this.storageService.deletePrompt(numericId);
      await this.loadPrompts(); // Reload the list after deletion
      
      this.dispatchEvent(new CustomEvent('prompt-deleted', {
        detail: { id: numericId },
        bubbles: true,
        composed: true
      }));
    } catch (error) {
      console.error('Failed to delete prompt:', error);
      // Show error message
      const errorMessage = this.shadowRoot.querySelector('.error-message');
      if (errorMessage) {
        errorMessage.textContent = 'Failed to delete prompt. Please try again.';
        errorMessage.style.display = 'block';
        setTimeout(() => {
          errorMessage.style.display = 'none';
        }, 3000);
      }
    }
  }

  setupEventListeners() {
    const createButton = this.shadowRoot.querySelector('.create-button');
    createButton.addEventListener('click', () => {
      window.history.pushState({}, '', '/editor');
      window.dispatchEvent(new CustomEvent('route-changed', {
        detail: { path: '/editor' }
      }));
    });

    // Card click event (for editing)
    this.shadowRoot.querySelectorAll('.prompt-card').forEach(card => {
      const deleteButton = card.querySelector('.delete-button');
      
      // Delete button click
      deleteButton?.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click
        const promptId = e.currentTarget.dataset.id;
        this.showDeleteModal(promptId);
      });

      // Card click (for editing)
      card.addEventListener('click', (e) => {
        // Don't navigate if clicking delete button
        if (e.target.closest('.delete-button')) {
          return;
        }

        const promptId = e.currentTarget.dataset.id;
        window.history.pushState({}, '', `/editor?id=${promptId}`);
        window.dispatchEvent(new CustomEvent('route-changed', {
          detail: { path: `/editor?id=${promptId}` }
        }));
      });
    });

    // Modal events
    const modalOverlay = this.shadowRoot.querySelector('.modal-overlay');
    const cancelButton = this.shadowRoot.querySelector('.modal-cancel');
    const confirmButton = this.shadowRoot.querySelector('.modal-confirm');

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        this.hideDeleteModal();
      }
    });

    cancelButton.addEventListener('click', () => {
      this.hideDeleteModal();
    });

    confirmButton.addEventListener('click', async () => {
      if (this.promptToDelete) {
        await this.deletePrompt(this.promptToDelete);
        this.hideDeleteModal();
      }
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