export class AppNavigation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isMobile = false;
    this.isMenuOpen = false;
    this.currentPath = window.location.pathname || '/prompts';
    this.render();
    this.setupEventListeners();
    // Force an immediate active state update
    requestAnimationFrame(() => this.updateActiveLink());
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        nav {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .menu-button {
          display: none;
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 0.5rem;
        }

        .menu-button svg {
          width: 24px;
          height: 24px;
        }

        .nav-links {
          display: flex;
          gap: 1rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-links a {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          color: inherit;
          text-decoration: none;
          border-radius: 6px;
          transition: background-color 0.2s ease;
        }

        .nav-links a:hover {
          background-color: var(--hover-color, rgba(0, 0, 0, 0.05));
        }

        .nav-links a[aria-current="page"] {
          background-color: var(--active-color, rgba(0, 0, 0, 0.08));
        }

        .nav-links a svg {
          width: 20px;
          height: 20px;
        }

        @media (max-width: 767px) {
          .menu-button {
            display: block;
          }

          nav.visible .nav-links {
            display: flex;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: var(--header-background, #ffffff);
            padding: 1rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            flex-direction: column;
          }

          .nav-links {
            display: none;
          }
        }

        @media (prefers-color-scheme: dark) {
          .nav-links a:hover {
            --hover-color: rgba(255, 255, 255, 0.05);
          }

          .nav-links a[aria-current="page"] {
            --active-color: rgba(255, 255, 255, 0.08);
          }
        }
      </style>
      <nav>
        <button class="menu-button" aria-label="Toggle menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        </button>
        <ul class="nav-links">
          <li>
            <a href="/prompts" aria-current="${this.currentPath === '/prompts' ? 'page' : 'false'}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Prompts
            </a>
          </li>
          <li>
            <a href="/analytics" aria-current="${this.currentPath === '/analytics' ? 'page' : 'false'}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              Analytics
            </a>
          </li>
          <li>
            <a href="/testing" aria-current="${this.currentPath === '/testing' ? 'page' : 'false'}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              Testing
            </a>
          </li>
          <li>
            <a href="/settings" aria-current="${this.currentPath === '/settings' ? 'page' : 'false'}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Settings
            </a>
          </li>
        </ul>
      </nav>
    `;
  }

  setupEventListeners() {
    // Setup media query
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    this.handleMediaQueryChange(mediaQuery);
    
    // Support both old and new media query APIs
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', e => this.handleMediaQueryChange(e));
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(e => this.handleMediaQueryChange(e));
    }

    // Setup menu button
    const menuButton = this.shadowRoot.querySelector('.menu-button');
    menuButton.addEventListener('click', () => {
      this.isMenuOpen = !this.isMenuOpen;
      this.updateMenuVisibility();
    });

    // Setup navigation links
    const links = this.shadowRoot.querySelectorAll('.nav-links a');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        window.history.pushState({}, '', href);
        this.updateActiveLink();
        if (this.isMobile) {
          this.isMenuOpen = false;
          this.updateMenuVisibility();
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.shadowRoot.contains(e.target)) {
        this.isMenuOpen = false;
        this.updateMenuVisibility();
      }
    });
  }

  handleMediaQueryChange(e) {
    this.isMobile = e.matches;
    if (!this.isMobile) {
      this.isMenuOpen = false;
    }
    this.updateMenuVisibility();
  }

  updateMenuVisibility() {
    const nav = this.shadowRoot.querySelector('nav');
    nav.classList.toggle('visible', this.isMenuOpen);
  }

  updateActiveLink() {
    const links = this.shadowRoot.querySelectorAll('.nav-links a');
    const currentPath = window.location.pathname || '/prompts';
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (currentPath === href) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.setAttribute('aria-current', 'false');
      }
    });
  }
}

customElements.define('app-navigation', AppNavigation); 