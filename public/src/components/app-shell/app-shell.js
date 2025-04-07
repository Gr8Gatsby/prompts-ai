class AppShell extends HTMLElement {
  constructor() {
    super();
    // No need to attach shadow root as it's already created by DSD
  }

  connectedCallback() {
    this.render();
    this.setupNavigation();
  }

  render() {
    this.innerHTML = `
      <style>
        :host {
          display: block;
          min-height: 100vh;
          display: grid;
          grid-template-rows: auto 1fr auto;
        }

        header {
          background: #f5f5f5;
          padding: 1rem;
        }

        nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          gap: 1rem;
        }

        main {
          padding: 1rem;
        }

        section {
          display: none;
        }

        section[aria-current="page"] {
          display: block;
        }

        footer {
          background: #f5f5f5;
          padding: 1rem;
          text-align: center;
        }
      </style>

      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="#prompts" data-page="prompts">Prompts</a></li>
            <li><a href="#analytics" data-page="analytics">Analytics</a></li>
            <li><a href="#testing" data-page="testing">Testing</a></li>
            <li><a href="#settings" data-page="settings">Settings</a></li>
          </ul>
        </nav>
      </header>

      <main role="main">
        <section id="prompts" aria-labelledby="prompts-heading">
          <h1 id="prompts-heading">Prompt Management</h1>
        </section>

        <section id="analytics" aria-labelledby="analytics-heading">
          <h1 id="analytics-heading">Analytics Dashboard</h1>
        </section>

        <section id="testing" aria-labelledby="testing-heading">
          <h1 id="testing-heading">Prompt Testing</h1>
        </section>

        <section id="settings" aria-labelledby="settings-heading">
          <h1 id="settings-heading">Settings</h1>
        </section>
      </main>

      <footer role="contentinfo">
        <p>Prompt Management App</p>
      </footer>
    `;
  }

  setupNavigation() {
    const links = this.querySelector('nav a');
    const sections = this.querySelectorAll('section');

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        
        // Update active link
        links.forEach(l => l.removeAttribute('aria-current'));
        link.setAttribute('aria-current', 'page');
        
        // Show selected section
        sections.forEach(section => {
          section.removeAttribute('aria-current');
          if (section.id === page) {
            section.setAttribute('aria-current', 'page');
          }
        });
      });
    });

    // Set initial page
    const initialPage = window.location.hash.slice(1) || 'prompts';
    const initialLink = this.querySelector(`a[data-page="${initialPage}"]`);
    if (initialLink) {
      initialLink.click();
    }
  }
}

customElements.define('app-shell', AppShell); 