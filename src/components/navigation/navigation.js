class Navigation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isMobile = window.matchMedia('(max-width: 767px)').matches;
    this.loadIcons();
    this.render();
  }

  async loadIcons() {
    // Create a link element for the font
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0';
    
    // Wait for the font to load
    await new Promise((resolve) => {
      link.onload = resolve;
      document.head.appendChild(link);
    });
  }

  connectedCallback() {
    this.setupNavigation();
    this.setupMobileDetection();
    this.setupClickOutsideHandler();
    this.setInitialActiveState();
  }

  disconnectedCallback() {
    this.mediaQuery?.removeEventListener('change', this.handleMobileChange);
    document.removeEventListener('click', this.handleClickOutside);
  }

  setupMobileDetection() {
    this.mediaQuery = window.matchMedia('(max-width: 767px)');
    this.handleMobileChange = (e) => {
      this.isMobile = e.matches;
      this.updateMobileStyles();
    };
    this.mediaQuery.addEventListener('change', this.handleMobileChange);
    this.updateMobileStyles();
  }

  setupClickOutsideHandler() {
    this.handleClickOutside = (e) => {
      const menu = this.shadowRoot.querySelector('ul');
      const menuButton = this.shadowRoot.querySelector('.menu-button');
      if (this.isMobile && menu.classList.contains('open') && 
          !menu.contains(e.target) && !menuButton.contains(e.target)) {
        menu.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    };
    document.addEventListener('click', this.handleClickOutside);
  }

  updateMobileStyles() {
    const menuButton = this.shadowRoot.querySelector('.menu-button');
    if (this.isMobile) {
      menuButton.style.display = 'flex';
    } else {
      menuButton.style.display = 'none';
      const menu = this.shadowRoot.querySelector('ul');
      menu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  }

  setInitialActiveState() {
    const links = this.shadowRoot.querySelectorAll('a');
    const currentPath = window.location.pathname;
    links.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background: var(--nav-bg, #1a1a1a);
          color: var(--nav-text, #ffffff);
          border-bottom: none;
        }

        nav {
          width: 100%;
          padding: 0 24px;
          box-sizing: border-box;
          border-bottom: none;
          height: 44px;
          display: flex;
          align-items: center;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          gap: 8px;
          height: 44px;
          align-items: center;
          border-bottom: none;
        }

        li {
          position: relative;
        }

        a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--nav-text, #ffffff);
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: -0.01em;
          transition: all 0.2s ease;
          -webkit-font-smoothing: antialiased;
          white-space: nowrap;
          opacity: 0.8;
        }

        .material-symbols-rounded {
          font-family: 'Material Symbols Rounded';
          font-weight: normal;
          font-style: normal;
          font-size: 20px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          font-feature-settings: "liga";
        }

        a:hover {
          background: var(--nav-hover, rgba(255, 255, 255, 0.1));
          opacity: 0.9;
        }

        a[aria-current="page"] {
          opacity: 1;
          background: var(--nav-active, rgba(255, 255, 255, 0.15));
        }

        a[aria-current="page"] .material-symbols-rounded {
          font-variation-settings: 'FILL' 1;
        }

        /* Selected indicator line */
        a[aria-current="page"]::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--nav-text, #ffffff);
          border-radius: 1px;
          opacity: 0.8;
        }

        .menu-button {
          display: ${this.isMobile ? 'flex' : 'none'};
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: var(--nav-text, #ffffff);
          padding: 8px;
          cursor: pointer;
          border-radius: 6px;
          transition: background-color 0.2s ease;
          height: 36px;
          width: 36px;
          margin: 4px 0;
        }

        .menu-button:hover {
          background: var(--nav-hover, rgba(255, 255, 255, 0.1));
        }

        @media (max-width: 767px) {
          nav {
            padding: 0 16px;
            position: relative;
            height: 44px;
            display: flex;
            align-items: center;
          }

          ul {
            position: absolute;
            top: 44px;
            left: 0;
            right: 0;
            flex-direction: column;
            background: var(--nav-bg, #1a1a1a);
            height: auto;
            padding: 8px;
            gap: 4px;
            transform: translateY(-100%);
            opacity: 0;
            transition: all 0.2s ease;
            pointer-events: none;
            z-index: 100;
            margin: 0;
          }

          ul.open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: all;
          }

          li {
            width: 100%;
          }

          a {
            width: 100%;
            padding: 12px;
            justify-content: flex-start;
          }

          a[aria-current="page"]::after {
            display: none;
          }
        }

        @media (prefers-color-scheme: dark) {
          :host {
            --nav-bg: #000000;
            --nav-text: #ffffff;
            --nav-hover: rgba(255, 255, 255, 0.1);
            --nav-active: rgba(255, 255, 255, 0.15);
          }
        }
      </style>

      <nav role="navigation" aria-label="Main navigation">
        <button class="menu-button" aria-label="Toggle navigation menu" aria-expanded="false">
          <span class="material-symbols-rounded">menu</span>
        </button>
        <ul>
          <li>
            <a href="/prompts" data-page="prompts">
              <span class="material-symbols-rounded">edit_note</span>
              <span>Prompts</span>
            </a>
          </li>
          <li>
            <a href="/analytics" data-page="analytics">
              <span class="material-symbols-rounded">analytics</span>
              <span>Analytics</span>
            </a>
          </li>
          <li>
            <a href="/testing" data-page="testing">
              <span class="material-symbols-rounded">science</span>
              <span>Testing</span>
            </a>
          </li>
          <li>
            <a href="/settings" data-page="settings">
              <span class="material-symbols-rounded">settings</span>
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </nav>
    `;
  }

  setupNavigation() {
    const menuButton = this.shadowRoot.querySelector('.menu-button');
    const menu = this.shadowRoot.querySelector('ul');
    const links = this.shadowRoot.querySelectorAll('a');

    // Toggle mobile menu
    menuButton.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', isOpen.toString());
    });

    // Handle navigation
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        
        // Dispatch navigation event
        document.dispatchEvent(new CustomEvent('navigate', {
          detail: { page },
          bubbles: true,
          composed: true
        }));

        // Update active state
        links.forEach(l => l.removeAttribute('aria-current'));
        link.setAttribute('aria-current', 'page');

        // Close mobile menu if open
        if (this.isMobile) {
          menu.classList.remove('open');
          menuButton.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }
}

// Only define the custom element if it hasn't been defined yet
if (!customElements.get('app-navigation')) {
  customElements.define('app-navigation', Navigation);
} 