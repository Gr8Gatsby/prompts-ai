// Import only the components we have implemented so far
import '../prompt-list/prompt-list.js';
import '../prompt-editor/prompt-editor.js';

class Router extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentRoute = window.location.pathname.substring(1) || 'prompts';
    this.promptId = null;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    // Handle initial route
    this.handleRouteChange();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          height: 100%;
        }

        .router-outlet {
          height: 100%;
        }

        h1 {
          margin: 0 0 24px 0;
          font-size: 24px;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--text-color, #000000);
        }

        .placeholder {
          padding: 24px;
          text-align: center;
          color: var(--text-color, #666666);
          background: var(--background-color, #f5f5f5);
          border-radius: 8px;
        }

        @media (max-width: 767px) {
          h1 {
            font-size: 20px;
            margin-bottom: 16px;
          }
        }

        @media (prefers-color-scheme: dark) {
          :host {
            --text-color: #ffffff;
            --background-color: #2c2c2e;
          }
        }
      </style>

      <div class="router-outlet">
        <h1></h1>
        <div class="content"></div>
      </div>
    `;
  }

  setupEventListeners() {
    window.addEventListener('popstate', () => {
      this.handleRouteChange();
    });

    // Listen for navigation events from the navigation component
    document.addEventListener('navigate', (e) => {
      this.navigateTo(e.detail.page);
    });

    // Listen for create/edit events from prompt-list
    document.addEventListener('create-prompt', () => {
      this.navigateTo('editor');
    });

    document.addEventListener('edit-prompt', (e) => {
      if (e.detail && e.detail.promptId) {
        this.navigateTo('editor', e.detail.promptId);
      }
    });

    // Listen for save/cancel events from prompt-editor
    document.addEventListener('save-prompt', () => {
      this.navigateTo('prompts');
    });

    document.addEventListener('cancel-edit', () => {
      this.navigateTo('prompts');
    });
  }

  handleRouteChange() {
    const outlet = this.shadowRoot.querySelector('.content');
    const title = this.shadowRoot.querySelector('h1');

    // Clear the outlet before adding new content
    outlet.innerHTML = '';

    // Always update route from URL during route changes
    this.currentRoute = window.location.pathname.split('/')[1] || 'prompts';
    this.promptId = new URLSearchParams(window.location.search).get('id');

    // Handle routes
    switch (this.currentRoute) {
      case 'editor':
        title.textContent = this.promptId ? 'Edit Prompt' : 'Create Prompt';
        const editor = document.createElement('prompt-editor');
        if (this.promptId) {
          editor.setAttribute('prompt-id', this.promptId);
        }
        outlet.appendChild(editor);
        break;

      case 'analytics':
        title.textContent = 'Analytics Dashboard';
        outlet.innerHTML = '<div class="placeholder">Analytics Dashboard coming soon...</div>';
        break;

      case 'testing':
        title.textContent = 'Prompt Testing';
        outlet.innerHTML = '<div class="placeholder">Testing Interface coming soon...</div>';
        break;

      case 'settings':
        title.textContent = 'Settings';
        outlet.innerHTML = '<div class="placeholder">Settings Panel coming soon...</div>';
        break;

      case 'prompts':
      default:
        title.textContent = 'Prompt Management';
        const list = document.createElement('prompt-list');
        outlet.appendChild(list);
        break;
    }

    // Update document title
    document.title = `Prompts AI - ${title.textContent}`;
  }

  navigateTo(route, promptId = null) {
    let path = `/${route}`;
    if (promptId) {
      path += `?id=${promptId}`;
    }
    // Update the current route before pushing state
    this.currentRoute = route;
    this.promptId = promptId;
    
    window.history.pushState({}, '', path);
    this.handleRouteChange();
  }
}

if (!customElements.get('app-router')) {
  customElements.define('app-router', Router);
} 