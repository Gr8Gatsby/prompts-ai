class PromptEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.prompt = {
      title: '',
      content: '',
      tags: []
    };
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
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

        .tags-input {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
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
          flex: 1;
          min-width: 120px;
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

        .save-button {
          background-color: var(--accent-color, #007aff);
          color: white;
          border: none;
        }

        .save-button:hover {
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
      </style>

      <div class="editor-container">
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" id="title" value="${this.prompt.title}" placeholder="Enter prompt title">
        </div>

        <div class="form-group">
          <label for="content">Prompt Content</label>
          <textarea id="content" placeholder="Enter your prompt content">${this.prompt.content}</textarea>
        </div>

        <div class="form-group">
          <label>Tags</label>
          <div class="tags-input">
            ${this.prompt.tags.map(tag => `
              <span class="tag">
                ${tag}
                <span class="tag-remove" data-tag="${tag}">×</span>
              </span>
            `).join('')}
            <input type="text" class="tag-input" placeholder="Add a tag and press Enter">
          </div>
        </div>

        <div class="actions">
          <button class="cancel-button">Cancel</button>
          <button class="save-button">Save Prompt</button>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const tagInput = this.shadowRoot.querySelector('.tag-input');
    const titleInput = this.shadowRoot.querySelector('#title');
    const contentInput = this.shadowRoot.querySelector('#content');
    const saveButton = this.shadowRoot.querySelector('.save-button');
    const cancelButton = this.shadowRoot.querySelector('.cancel-button');

    tagInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && tagInput.value.trim()) {
        e.preventDefault();
        this.prompt.tags.push(tagInput.value.trim());
        tagInput.value = '';
        this.render();
      }
    });

    this.shadowRoot.querySelectorAll('.tag-remove').forEach(removeBtn => {
      removeBtn.addEventListener('click', (e) => {
        const tagToRemove = e.target.dataset.tag;
        this.prompt.tags = this.prompt.tags.filter(tag => tag !== tagToRemove);
        this.render();
      });
    });

    saveButton.addEventListener('click', () => {
      this.prompt.title = titleInput.value;
      this.prompt.content = contentInput.value;
      
      this.dispatchEvent(new CustomEvent('save-prompt', {
        detail: { prompt: this.prompt }
      }));
    });

    cancelButton.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('cancel-edit'));
    });
  }

  setPrompt(prompt) {
    this.prompt = { ...prompt };
    this.render();
  }
}

customElements.define('prompt-editor', PromptEditor); 