import { StorageService } from '../../services/storage.js';

class PromptEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.prompt = {
      title: '',
      content: '',
      tags: []
    };
    this.originalPrompt = null;
    this.saveTimeout = null;
    this.storageService = new StorageService();
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    
    // If we have a prompt ID, load the prompt
    const promptId = this.getAttribute('prompt-id');
    if (promptId) {
      this.loadPrompt(promptId);
    }
  }

  async loadPrompt(id) {
    try {
      const prompt = await this.storageService.getPrompt(id);
      this.prompt = { ...prompt };
      this.originalPrompt = { ...prompt };
      this.render();
      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to load prompt:', error);
      this.dispatchEvent(new CustomEvent('error', {
        detail: { message: 'Failed to load prompt' },
        bubbles: true,
        composed: true
      }));
    }
  }

  validateForm() {
    const titleInput = this.shadowRoot?.querySelector('#title');
    const contentInput = this.shadowRoot?.querySelector('#content');
    const saveButton = this.shadowRoot?.querySelector('.save-button');
    const titleError = this.shadowRoot?.querySelector('#title-error');
    const contentError = this.shadowRoot?.querySelector('#content-error');
    
    if (!titleInput || !contentInput || !saveButton || !titleError || !contentError) return false;

    let isValid = true;
    
    if (!titleInput.value.trim()) {
      isValid = false;
      titleInput.classList.add('invalid');
      titleError.classList.add('visible');
    } else {
      titleInput.classList.remove('invalid');
      titleError.classList.remove('visible');
    }

    if (!contentInput.value.trim()) {
      isValid = false;
      contentInput.classList.add('invalid');
      contentError.classList.add('visible');
    } else {
      contentInput.classList.remove('invalid');
      contentError.classList.remove('visible');
    }

    saveButton.disabled = !isValid;
    return isValid;
  }

  addTag(tagValue) {
    const newTag = tagValue.trim();
    if (newTag && !this.prompt.tags.includes(newTag)) {
      this.prompt.tags = [...this.prompt.tags, newTag];
      this.render();
      this.setupEventListeners();
      
      // Focus the tag input after adding a tag
      const tagInput = this.shadowRoot.querySelector('.tag-input');
      if (tagInput) {
        tagInput.focus();
      }
      return true;
    }
    return false;
  }

  removeTag(tagToRemove) {
    this.prompt.tags = this.prompt.tags.filter(tag => tag !== tagToRemove);
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const form = this.shadowRoot.querySelector('#prompt-form');
    const titleInput = this.shadowRoot.querySelector('#title');
    const contentInput = this.shadowRoot.querySelector('#content');
    const tagInput = this.shadowRoot.querySelector('.tag-input');
    const saveButton = this.shadowRoot.querySelector('.save-button');
    const cancelButton = this.shadowRoot.querySelector('.cancel-button');

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (this.validateForm()) {
        try {
          // Update prompt with current form values
          this.prompt = {
            ...this.prompt,
            title: titleInput.value.trim(),
            content: contentInput.value.trim()
          };
          
          const id = await this.storageService.createPrompt(this.prompt);
          this.prompt.id = id;
          this.showSaveConfirmation();
          this.dispatchEvent(new CustomEvent('prompt-saved', { detail: { id } }));
        } catch (error) {
          console.error('Failed to save prompt:', error);
        }
      }
    });

    // Input validation
    titleInput.addEventListener('input', () => this.validateForm());
    contentInput.addEventListener('input', () => this.validateForm());

    // Tag input handling
    tagInput.addEventListener('keydown', (e) => {
      if (e.key === ' ' && tagInput.value.trim()) {
        e.preventDefault();
        this.addTag(tagInput.value.trim());
        tagInput.value = '';
      }
    });

    // Tag removal
    const tagRemoveButtons = this.shadowRoot.querySelectorAll('.tag-remove');
    tagRemoveButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tag = button.closest('.tag');
        if (tag) {
          const tagText = tag.textContent.replace('×', '').trim();
          this.removeTag(tagText);
        }
      });
    });

    // Cancel button
    cancelButton.addEventListener('click', () => {
      this.prompt = { title: '', content: '', tags: [] };
      this.render(); // Re-render to update the form
      window.history.pushState({}, '', '/prompts');
      window.dispatchEvent(new CustomEvent('route-changed', {
        detail: { path: '/prompts' }
      }));
    });
  }

  showSaveConfirmation() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    const saveButton = this.shadowRoot?.querySelector('.save-button');
    if (saveButton) {
      const originalText = saveButton.textContent;
      saveButton.textContent = 'Saved!';
      
      this.saveTimeout = setTimeout(() => {
        if (saveButton) {
          saveButton.textContent = originalText;
        }
      }, 3000);
    }
  }

  escapeHtml(text) {
    return text.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          color: var(--text-primary);
        }

        .editor {
          max-width: var(--content-width);
          margin: 0 auto;
          background: var(--card-background);
          border: 1px solid var(--border-color);
          border-radius: var(--card-border-radius);
          padding: 32px;
          box-sizing: border-box;
        }

        .form-group {
          margin-bottom: 24px;
          width: 100%;
        }

        form {
          width: 100%;
          max-width: 100%;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
          letter-spacing: 0.01em;
        }

        .input {
          width: 100%;
          background: var(--input-background);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--input-border-radius);
          padding: 12px;
          font-size: 15px;
          transition: all 0.2s ease;
          box-sizing: border-box;
          display: block;
        }

        .input:focus {
          border-color: var(--accent-primary);
          box-shadow: var(--input-focus-ring);
          outline: none;
        }

        .input::placeholder {
          color: var(--text-tertiary);
        }

        .input.invalid {
          border-color: var(--accent-error);
          background: var(--error-alpha);
        }

        textarea.input {
          height: 200px;
          resize: vertical;
          line-height: 1.5;
          font-family: inherit;
          margin: 0;
          display: block;
        }

        .tags-input {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: var(--input-border-radius);
          background: var(--input-background);
          min-height: 48px;
          align-items: flex-start;
          width: 100%;
          box-sizing: border-box;
        }

        .tags-input:focus-within {
          border-color: var(--accent-primary);
          box-shadow: var(--input-focus-ring);
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--button-secondary-bg);
          color: var(--text-primary);
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: var(--font-weight-medium);
          border: 1px solid var(--button-secondary-border);
          line-height: 1.5;
        }

        .tag button {
          border: none;
          background: none;
          padding: 2px;
          color: var(--text-secondary);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s ease;
          font-size: 18px;
          width: 20px;
          height: 20px;
          line-height: 1;
        }

        .tag button:hover {
          color: var(--text-primary);
          background: var(--hover-overlay);
        }

        .tag-input {
          border: none;
          padding: 6px;
          background: none;
          color: var(--text-primary);
          font-size: 14px;
          min-width: 60px;
          flex: 1;
          line-height: 1.5;
          margin-top: 1px;
        }

        .tag-input:focus {
          outline: none;
        }

        .tag-input::placeholder {
          color: var(--text-tertiary);
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--spacing-md);
          margin-top: var(--spacing-lg);
        }

        .save-button {
          background: var(--button-primary-bg);
          color: var(--text-primary);
          height: 44px;
          padding: 0 24px;
          border-radius: 12px;
          font-size: 16px;
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

        .save-button:hover:not(:disabled) {
          background: var(--button-primary-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .save-button:active:not(:disabled) {
          background: var(--button-primary-active);
          transform: translateY(0);
          box-shadow: var(--shadow-sm);
        }

        .cancel-button {
          background: var(--button-secondary-bg);
          color: var(--text-primary);
          border: 2px solid var(--button-secondary-border);
          height: 44px;
          padding: 0 24px;
          border-radius: 12px;
          font-size: 16px;
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
          position: relative;
          overflow: hidden;
        }

        .cancel-button:hover:not(:disabled) {
          background: var(--button-secondary-hover);
          border-color: var(--button-secondary-border-hover);
          transform: translateY(-1px);
        }

        .cancel-button:active:not(:disabled) {
          transform: translateY(0);
          background: var(--button-secondary-bg);
        }

        .save-button:disabled {
          opacity: var(--disabled-opacity);
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        @media (max-width: 767px) {
          .editor {
            padding: var(--spacing-md);
          }
          
          .actions {
            margin-top: var(--spacing-md);
            padding-top: var(--spacing-md);
          }
        }

        .error-message {
          display: none;
          color: var(--accent-error);
          font-size: 12px;
          margin-top: 4px;
        }

        .error-message.visible {
          display: block;
        }

        .input.invalid + .error-message {
          display: block;
        }
      </style>

      <div class="editor">
        <form id="prompt-form">
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="title" class="input" value="${this.escapeHtml(this.prompt?.title || '')}" required>
            <div class="error-message" id="title-error">Title is required</div>
          </div>

          <div class="form-group">
            <label for="content">Prompt Content</label>
            <textarea id="content" class="input" required>${this.escapeHtml(this.prompt?.content || '')}</textarea>
            <div class="error-message" id="content-error">Content is required</div>
          </div>

          <div class="form-group">
            <label>Tags</label>
            <div class="tags-input">
              ${this.prompt?.tags.map(tag => `
                <span class="tag">${this.escapeHtml(tag)}<button type="button" class="tag-remove" data-tag="${this.escapeHtml(tag)}" aria-label="Remove tag">×</button></span>`).join('')}
              <input type="text" class="tag-input" placeholder="Add tag...">
            </div>
          </div>

          <div class="actions">
            <button type="button" class="cancel-button">Cancel</button>
            <button type="submit" class="save-button" disabled>Save Prompt</button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('prompt-editor', PromptEditor); 