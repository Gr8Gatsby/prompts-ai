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
          width: 100%;
          background: var(--secondary-background);
          border-bottom: 1px solid var(--border-color);
        }

        nav {
          display: flex;
          align-items: center;
          height: var(--header-height);
          padding: 0 var(--spacing-lg);
          max-width: var(--container-max-width);
          margin: 0 auto;
          gap: var(--spacing-md);
        }

        a {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          color: var(--text-secondary);
          text-decoration: none;
          border-radius: var(--border-radius-md);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          transition: color var(--transition-normal), background-color var(--transition-normal);
        }

        a:hover {
          color: var(--text-primary);
          background-color: var(--hover-overlay);
        }

        a[aria-current="page"] {
          color: var(--text-primary);
          background-color: var(--active-overlay);
        }

        svg {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }

        .menu-button {
          display: none;
          padding: var(--spacing-sm);
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
        }

        @media (max-width: 767px) {
          nav {
            padding: 0 var(--spacing-md);
          }

          .menu-button {
            display: block;
          }

          nav {
            position: fixed;
            top: var(--header-height);
            left: 0;
            right: 0;
            bottom: 0;
            flex-direction: column;
            align-items: stretch;
            background: var(--secondary-background);
            padding: var(--spacing-md);
            transform: translateX(-100%);
            transition: transform var(--transition-slow);
            z-index: var(--z-index-fixed);
          }

          nav.visible {
            transform: translateX(0);
          }

          a {
            padding: var(--spacing-md);
            border-radius: var(--border-radius-sm);
          }
        }
      </style>

      <button class="menu-button" aria-label="Toggle menu">
        <svg viewBox="0 0 24 24">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
      </button>

      <nav>
        <a href="/prompts" aria-current="page">
          <svg viewBox="0 0 24 24">
            <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          Prompts
        </a>
        <a href="/analytics">
          <svg viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/>
          </svg>
          Analytics
        </a>
        <a href="/testing">
          <svg viewBox="0 0 24 24">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"/>
          </svg>
          Testing
        </a>
        <a href="/settings">
          <svg viewBox="0 0 24 24">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
          </svg>
          Settings
        </a>
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
    const links = this.shadowRoot.querySelectorAll('nav a');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        window.history.pushState({}, '', href);
        this.updateActiveLink();
        
        // Dispatch a custom event for route changes
        window.dispatchEvent(new CustomEvent('route-changed', {
          detail: { path: href }
        }));

        if (this.isMobile) {
          this.isMenuOpen = false;
          this.updateMenuVisibility();
        }
      });
    });

    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', () => {
      this.updateActiveLink();
      window.dispatchEvent(new CustomEvent('route-changed', {
        detail: { path: window.location.pathname }
      }));
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
    const links = this.shadowRoot.querySelectorAll('nav a');
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