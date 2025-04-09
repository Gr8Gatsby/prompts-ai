import { BaseComponent } from '../base-component.js';

export class AppNavigation extends BaseComponent {
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

        .icon {
          width: 24px;
          height: 24px;
          display: inline-block;
          background-size: contain;
          background-repeat: no-repeat;
        }

        .icon-prompts {
          background-image: url('../icons/Feather Icons/home.svg');
        }

        .icon-analytics {
          background-image: url('../icons/Feather Icons/bar-chart-2.svg');
        }

        .icon-testing {
          background-image: url('../icons/Feather Icons/activity.svg');
        }

        .icon-settings {
          background-image: url('../icons/Feather Icons/settings.svg');
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
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Prompts
        </a>
        <a href="/analytics">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bar-chart-2">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          Analytics
        </a>
        <a href="/testing">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-activity">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          Testing
        </a>
        <a href="/settings">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-settings">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
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