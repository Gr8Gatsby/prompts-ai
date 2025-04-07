class Router extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback() {
    // Set initial route
    requestAnimationFrame(() => {
      this.handleRoute();
      // Listen for hash changes
      window.addEventListener('hashchange', () => this.handleRoute());
    });
  }

  disconnectedCallback() {
    window.removeEventListener('hashchange', () => this.handleRoute());
  }

  render() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        width: 100%;
      }

      ::slotted([data-page]) {
        display: none !important;
      }

      ::slotted([data-page][active]) {
        display: block !important;
      }
    `;

    const slot = document.createElement('slot');
    this.shadowRoot.replaceChildren(style, slot);
  }

  async handleRoute() {
    const hash = window.location.hash.slice(1);
    const validPages = ['prompts', 'analytics', 'testing', 'settings'];
    const currentPage = validPages.includes(hash) ? hash : 'prompts';
    
    // Update active state
    const pages = Array.from(this.children).filter(el => el.hasAttribute('data-page'));
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