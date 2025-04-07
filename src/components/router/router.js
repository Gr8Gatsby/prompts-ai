class Router extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback() {
    this.handleRoute();
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  disconnectedCallback() {
    window.removeEventListener('hashchange', () => this.handleRoute());
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        ::slotted([data-page]) {
          display: none;
        }
        ::slotted([data-page][active]) {
          display: block;
        }
      </style>
      <slot></slot>
    `;
  }

  async handleRoute() {
    const hash = window.location.hash.slice(1);
    const validPages = ['prompts', 'analytics', 'testing', 'settings'];
    const currentPage = validPages.includes(hash) ? hash : 'prompts';
    const pages = this.querySelectorAll('[data-page]');
    
    // Update active state
    pages.forEach(page => {
      if (page.dataset.page === currentPage) {
        page.setAttribute('active', '');
      } else {
        page.removeAttribute('active');
      }
    });

    // Dispatch page change event
    this.dispatchEvent(new CustomEvent('pagechange', {
      detail: { page: currentPage },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('app-router', Router); 