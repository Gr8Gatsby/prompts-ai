// Import only the components we have implemented so far
import '../prompt-list/prompt-list.js';
import '../prompt-editor/prompt-editor.js';
import '../settings-panel/settings-panel.js';

export class AppRouter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentRoute = '/prompts';
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .content {
          display: block;
        }

        h1 {
          margin: 0 0 1rem;
          font-size: 1.5rem;
          font-weight: 600;
        }
      </style>
      <div class="content">
        <h1>Prompt Management</h1>
        <prompt-list></prompt-list>
      </div>
    `;
  }

  setupEventListeners() {
    // Handle navigation events
    document.addEventListener('create-prompt', () => {
      this.navigateTo('/editor');
    });

    document.addEventListener('edit-prompt', (e) => {
      const promptId = e.detail?.promptId;
      this.navigateTo(`/editor${promptId ? `?id=${promptId}` : ''}`);
    });

    document.addEventListener('save-prompt', () => {
      this.navigateTo('/prompts');
    });

    document.addEventListener('cancel-edit', () => {
      this.navigateTo('/prompts');
    });

    // Handle route changes from navigation component
    window.addEventListener('route-changed', (e) => {
      this.navigateTo(e.detail.path);
    });

    // Handle browser navigation
    window.addEventListener('popstate', () => {
      this.handleRouteChange();
    });
  }

  navigateTo(path) {
    window.history.pushState({}, '', path);
    this.handleRouteChange();
  }

  handleRouteChange() {
    const path = window.location.pathname;
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const promptId = params.get('id');

    const title = this.getTitleForPath(path, promptId);
    const content = this.getContentForPath(path, promptId);

    const contentDiv = this.shadowRoot.querySelector('.content');
    const h1 = contentDiv.querySelector('h1');
    h1.textContent = title;
    
    const oldContent = contentDiv.querySelector('prompt-list, prompt-editor, analytics-dashboard, testing-interface, settings-panel');
    if (oldContent) {
      oldContent.remove();
    }
    
    contentDiv.insertAdjacentHTML('beforeend', content);
  }

  getContentForPath(path, promptId) {
    switch (path) {
      case '/editor':
        return `<prompt-editor prompt-id="${promptId || ''}"></prompt-editor>`;
      case '/analytics':
        return `<analytics-dashboard></analytics-dashboard>`;
      case '/testing':
        return `<testing-interface></testing-interface>`;
      case '/settings':
        return `<settings-panel></settings-panel>`;
      default:
        return `<prompt-list></prompt-list>`;
    }
  }

  getTitleForPath(path, promptId) {
    switch (path) {
      case '/editor':
        return promptId ? 'Edit Prompt' : 'Create Prompt';
      case '/analytics':
        return 'Analytics Dashboard';
      case '/testing':
        return 'Testing Interface';
      case '/settings':
        return 'Settings';
      default:
        return 'Prompt Management';
    }
  }
}

customElements.define('app-router', AppRouter); 