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
      this.setPrompt(prompt);
    } catch (error) {
      console.error('Failed to load prompt:', error);
      // TODO: Show error state
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 16px;
        }

        .editor-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .form-group {
          margin-bottom: 24px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: var(--text-color, #333);
        }

        input[type="text"],
        textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid var(--border-color, #e0e0e0);
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
        }

        input[type="text"]:focus,
        textarea:focus {
          outline: none;
          border-color: var(--accent-color, #007aff);
        }

        textarea {
          min-height: 200px;
          resize: vertical;
        }

        .tags-container {
          border: 1px solid var(--border-color, #e0e0e0);
          border-radius: 6px;
          padding: 8px;
          background: white;
        }

        .tags-input {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          width: 100%;
        }

        .tag {
          background: var(--tag-background, #f0f0f0);
          color: var(--tag-text-color, #666);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .tag-remove {
          cursor: pointer;
          color: var(--tag-remove-color, #999);
        }

        .tag-input {
          border: none;
          padding: 4px 0;
          width: 100%;
          min-width: 200px;
          outline: none;
        }

        .tag-input:focus {
          border-color: transparent;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 24px;
        }

        button {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .save-button {
          background-color: var(--accent-color, #007aff);
          color: white;
          border: none;
        }

        .save-button:not(:disabled):hover {
          background-color: var(--accent-hover-color, #0062cc);
        }

        .cancel-button {
          background-color: transparent;
          border: 1px solid var(--border-color, #e0e0e0);
          color: var(--text-color, #333);
        }

        .cancel-button:hover {
          background-color: var(--hover-background, rgba(0,0,0,0.05));
        }

        .error {
          color: var(--error-color, #ff3b30);
          font-size: 12px;
          margin-top: 4px;
          display: none;
        }

        .error.visible {
          display: block;
        }

        .save-confirmation {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: var(--success-color, #34c759);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          transform: translateY(100px);
          opacity: 0;
          transition: all 0.3s ease;
          z-index: 1000;
        }

        .save-confirmation.visible {
          transform: translateY(0);
          opacity: 1;
        }

        .tag-input-container {
          position: relative;
          width: 100%;
        }

        .tag-hint {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--hint-color, #999);
          font-size: 12px;
          pointer-events: none;
        }
      </style>

      <div class="editor-container">
        <form class="prompt-form">
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="title" value="${this.prompt.title}" placeholder="Enter prompt title">
            <div class="error" id="title-error">Title is required</div>
          </div>

          <div class="form-group">
            <label for="content">Prompt Content</label>
            <textarea id="content" placeholder="Enter your prompt content">${this.prompt.content}</textarea>
            <div class="error" id="content-error">Prompt content is required</div>
          </div>

          <div class="form-group">
            <label>Tags</label>
            <div class="tags-container">
              <div class="tags-input">
                ${this.prompt.tags.map(tag => `
                  <span class="tag">
                    ${tag}
                    <span class="tag-remove" data-tag="${tag}">×</span>
                  </span>
                `).join('')}
                <div class="tag-input-container">
                  <input type="text" class="tag-input" placeholder="Add a tag">
                  <span class="tag-hint">Press Tab to add</span>
                </div>
              </div>
            </div>
          </div>

          <div class="actions">
            <button type="button" class="cancel-button">Cancel</button>
            <button type="submit" class="save-button">Save Prompt</button>
          </div>
        </form>
      </div>

      <div class="save-confirmation">
        Prompt saved successfully!
      </div>
    `;
  }

  setupEventListeners() {
    const form = this.shadowRoot.querySelector('.prompt-form');
    const tagInput = this.shadowRoot.querySelector('.tag-input');
    const titleInput = this.shadowRoot.querySelector('#title');
    const contentInput = this.shadowRoot.querySelector('#content');
    const saveButton = this.shadowRoot.querySelector('.save-button');
    const cancelButton = this.shadowRoot.querySelector('.cancel-button');
    const titleError = this.shadowRoot.querySelector('#title-error');
    const contentError = this.shadowRoot.querySelector('#content-error');
    const saveConfirmation = this.shadowRoot.querySelector('.save-confirmation');

    const validateForm = () => {
      let isValid = true;
      
      if (!titleInput.value.trim()) {
        titleError.classList.add('visible');
        isValid = false;
      } else {
        titleError.classList.remove('visible');
      }

      if (!contentInput.value.trim()) {
        contentError.classList.add('visible');
        isValid = false;
      } else {
        contentError.classList.remove('visible');
      }

      saveButton.disabled = !isValid;
      return isValid;
    };

    const showSaveConfirmation = () => {
      saveConfirmation.classList.add('visible');
      if (this.saveTimeout) {
        clearTimeout(this.saveTimeout);
      }
      this.saveTimeout = setTimeout(() => {
        saveConfirmation.classList.remove('visible');
      }, 3000);
    };

    const addTag = () => {
      const newTag = tagInput.value.trim();
      if (newTag && !this.prompt.tags.includes(newTag)) {
        this.prompt.tags.push(newTag);
        tagInput.value = '';
        this.render();
        this.setupEventListeners();
      }
    };

    [titleInput, contentInput].forEach(input => {
      input.addEventListener('input', validateForm);
      input.addEventListener('blur', validateForm);
    });

    tagInput.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        addTag();
      } else if (e.key === 'Enter') {
        e.preventDefault(); // Prevent form submission
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      const updatedPrompt = {
        id: this.prompt.id, // Keep existing ID if editing
        title: titleInput.value.trim(),
        content: contentInput.value.trim(),
        tags: [...this.prompt.tags]
      };
      
      try {
        if (updatedPrompt.id) {
          await this.storageService.updatePrompt(updatedPrompt);
        } else {
          const id = await this.storageService.createPrompt(updatedPrompt);
          updatedPrompt.id = id;
        }

        showSaveConfirmation();
        
        // Emit events for both the router and the prompt list
        document.dispatchEvent(new CustomEvent('save-prompt', {
          bubbles: true,
          composed: true
        }));
        
        document.dispatchEvent(new CustomEvent('prompt-saved', {
          detail: { prompt: updatedPrompt },
          bubbles: true,
          composed: true
        }));
      } catch (error) {
        console.error('Failed to save prompt:', error);
        // TODO: Show error state
      }
    });

    this.shadowRoot.querySelectorAll('.tag-remove').forEach(removeBtn => {
      removeBtn.addEventListener('click', (e) => {
        const tagToRemove = e.target.dataset.tag;
        this.prompt.tags = this.prompt.tags.filter(tag => tag !== tagToRemove);
        this.render();
        this.setupEventListeners();
      });
    });

    cancelButton.addEventListener('click', () => {
      if (this.originalPrompt) {
        this.prompt = { ...this.originalPrompt };
      } else {
        this.prompt = { title: '', content: '', tags: [] };
      }
      
      this.dispatchEvent(new CustomEvent('cancel-edit', {
        bubbles: true,
        composed: true
      }));
      
      this.render();
      this.setupEventListeners();
    });

    // Initial validation
    validateForm();
  }

  setPrompt(prompt) {
    this.originalPrompt = { ...prompt };
    this.prompt = { ...prompt };
    this.render();
    this.setupEventListeners();
  }
}

customElements.define('prompt-editor', PromptEditor); 