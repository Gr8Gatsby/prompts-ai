class Navigation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback() {
    this.setupNavigation();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        nav {
          display: block;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          gap: 1rem;
        }

        a {
          color: #333;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        a:hover {
          background-color: #e0e0e0;
        }

        a[aria-current="page"] {
          background-color: #e0e0e0;
          font-weight: bold;
        }
      </style>

      <nav role="navigation" aria-label="Main navigation">
        <ul>
          <li><a href="#prompts" data-page="prompts">Prompts</a></li>
          <li><a href="#analytics" data-page="analytics">Analytics</a></li>
          <li><a href="#testing" data-page="testing">Testing</a></li>
          <li><a href="#settings" data-page="settings">Settings</a></li>
        </ul>
      </nav>
    `;
  }

  setupNavigation() {
    const links = this.shadowRoot.querySelectorAll('a');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        
        // Update active link
        links.forEach(l => l.removeAttribute('aria-current'));
        link.setAttribute('aria-current', 'page');
        
        // Dispatch navigation event
        this.dispatchEvent(new CustomEvent('navigation', {
          detail: { page },
          bubbles: true,
          composed: true
        }));
      });
    });

    // Set initial page
    const initialPage = window.location.hash.slice(1) || 'prompts';
    const initialLink = this.shadowRoot.querySelector(`a[data-page="${initialPage}"]`);
    if (initialLink) {
      initialLink.click();
    }
  }
}

customElements.define('app-navigation', Navigation); 