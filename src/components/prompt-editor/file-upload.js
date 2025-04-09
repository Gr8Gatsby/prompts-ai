import { BaseComponent } from '../base-component.js';

export class FileUpload extends BaseComponent {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.files = [];
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }

        .file-upload {
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          padding: var(--spacing-md);
          background: var(--input-background);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-sm);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          background: var(--card-background);
        }

        .file-item input {
          border: none;
          background: none;
          color: var(--text-primary);
          font-size: var(--font-size-sm);
          flex: 1;
          margin-right: var(--spacing-sm);
        }

        .file-item button {
          background: none;
          border: none;
          color: var(--accent-error);
          cursor: pointer;
        }

        .file-item button:hover {
          color: var(--text-primary);
        }

        .file-icon {
          margin-right: var(--spacing-sm);
        }

        .upload-button {
          background: var(--button-primary-bg);
          color: var(--text-primary);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--border-radius-md);
          cursor: pointer;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .upload-button:hover {
          background: var(--button-primary-hover);
        }
      </style>

      <div class="file-upload">
        <input type="file" id="file-input" multiple hidden />
        <button class="upload-button" type="button">Upload Files</button>
        <div class="file-list">
          ${this.files.map(file => this.renderFileItem(file)).join('')}
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  renderFileItem(file) {
    const icon = this.getFileIcon(file.type);
    return `
      <div class="file-item">
        <span class="file-icon">${icon}</span>
        <input type="text" value="${file.name}" />
        <button type="button" class="delete-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m5 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    `;
  }

  getFileIcon(type) {
    const extension = type.split('/').pop();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
    const textExtensions = ['txt', 'md', 'doc', 'docx', 'pdf', 'rtf'];
    const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'webm'];
    const audioExtensions = ['mp3', 'wav', 'aac', 'flac', 'ogg'];

    if (imageExtensions.includes(extension)) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-image">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>`;
    }
    if (textExtensions.includes(extension)) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>`;
    }
    if (videoExtensions.includes(extension)) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-video">
        <polygon points="23 7 16 12 23 17 23 7"></polygon>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
      </svg>`;
    }
    if (audioExtensions.includes(extension)) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-music">
        <path d="M9 18V5l12-2v13"></path>
        <circle cx="6" cy="18" r="3"></circle>
        <circle cx="18" cy="16" r="3"></circle>
      </svg>`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>`;
  }

  setupEventListeners() {
    const fileInput = this.shadowRoot.querySelector('#file-input');
    const uploadButton = this.shadowRoot.querySelector('.upload-button');
    const fileList = this.shadowRoot.querySelector('.file-list');
    const modalOverlay = this.shadowRoot.querySelector('.modal-overlay');
    const cancelButton = this.shadowRoot.querySelector('.modal-cancel');
    const confirmButton = this.shadowRoot.querySelector('.modal-confirm');

    if (uploadButton) {
      uploadButton.addEventListener('click', () => fileInput?.click());
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const newFiles = Array.from(e.target.files);
        this.files = [...this.files, ...newFiles];
        this.render();
      });
    }

    if (fileList) {
      fileList.addEventListener('click', (e) => {
        if (e.target.closest('.delete-button')) {
          const index = Array.from(fileList.children).indexOf(e.target.closest('.file-item'));
          if (index !== -1) {
            this.showDeleteModal(index);
          }
        }
      });
    }

    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          this.hideDeleteModal();
        }
      });
    }

    if (cancelButton) {
      cancelButton.addEventListener('click', () => {
        this.hideDeleteModal();
      });
    }

    if (confirmButton) {
      confirmButton.addEventListener('click', () => {
        if (this.fileToDelete !== null) {
          this.files.splice(this.fileToDelete, 1);
          this.fileToDelete = null;
          this.render();
          this.hideDeleteModal();
        }
      });
    }
  }

  showDeleteModal(index) {
    this.fileToDelete = index;
    const modal = this.shadowRoot.querySelector('.modal-overlay');
    modal.classList.add('visible');
  }

  hideDeleteModal() {
    this.fileToDelete = null;
    const modal = this.shadowRoot.querySelector('.modal-overlay');
    modal.classList.remove('visible');
  }
}

customElements.define('file-upload', FileUpload); 