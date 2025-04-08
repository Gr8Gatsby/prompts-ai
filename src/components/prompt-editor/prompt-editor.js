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
          color: #ffffff;
        }

        .editor {
          composes: card;
          max-width: var(--content-width);
          margin: 0 auto;
          background: #1a1a1a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
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
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
          letter-spacing: 0.01em;
        }

        .input {
          composes: input;
          width: 100%;
          background: #2a2a2a;
          color: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          padding: 12px;
          font-size: 15px;
          transition: all 0.2s ease;
          box-sizing: border-box;
          display: block;
        }

        .input:focus {
          border-color: #4d9fff;
          box-shadow: 0 0 0 2px rgba(77, 159, 255, 0.25);
          outline: none;
        }

        .input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .input.invalid {
          border-color: #ff4d4d;
          background: rgba(255, 77, 77, 0.1);
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
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          background: #2a2a2a;
          min-height: 48px;
          align-items: flex-start;
          width: 100%;
          box-sizing: border-box;
        }

        .tags-input:focus-within {
          border-color: #4d9fff;
          box-shadow: 0 0 0 2px rgba(77, 159, 255, 0.25);
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #333333;
          color: rgba(255, 255, 255, 0.95);
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid rgba(255, 255, 255, 0.2);
          line-height: 1.5;
        }

        .tag button {
          border: none;
          background: none;
          padding: 2px;
          color: rgba(255, 255, 255, 0.6);
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
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .tag-input {
          border: none;
          padding: 6px;
          background: none;
          color: rgba(255, 255, 255, 0.95);
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
          color: rgba(255, 255, 255, 0.4);
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          width: 100%;
        }

        .save-button {
          background: #4d9fff;
          color: #ffffff;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          min-width: 100px;
          transition: all 0.2s ease;
        }

        .save-button:hover {
          background: #3d8fee;
        }

        .save-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #4d9fff;
        }

        .cancel-button {
          background: transparent;
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          min-width: 100px;
          transition: all 0.2s ease;
        }

        .cancel-button:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.3);
        }

        @media (max-width: 767px) {
          .editor {
            padding: 24px;
          }
          
          .actions {
            margin-top: 24px;
            padding-top: 16px;
          }
        }

        .error-message {
          display: none;
          color: #ff4d4d;
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
                <span class="tag">
                  ${this.escapeHtml(tag)}
                  <button type="button" class="tag-remove" data-tag="${this.escapeHtml(tag)}" aria-label="Remove tag">×</button>
                </span>
              `).join('')}
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