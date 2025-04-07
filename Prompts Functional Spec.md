# Prompt Management Web App (Frontend-Only)

A responsive, accessible, and deployable prompt management application built with TDD and hosted on GitHub Pages. Prompts are stored in the browser via `localStorage` and support tagging, importing/exporting, and clipboard copying.

---

## 🧹 Features

### Core
- [ ] Create, edit, delete prompt entries
  - [ ] Title field (required)
  - [ ] Prompt text (required)
  - [ ] Tags (for categorization)
  - [ ] Sample data attachments (text, image, audio, video)
  - [ ] Delete confirmation dialog
- [ ] Store prompts in `localStorage`
- [ ] Add tags to each prompt
- [ ] Search/filter prompts by:
  - [ ] Tag
  - [ ] Title keywords
  - [ ] Prompt content keywords
- [ ] Copy prompt to clipboard
- [ ] Share prompts via:
  - [ ] Direct link
  - [ ] Export to JSON
  - [ ] Social media sharing
- [ ] Import/export prompts to/from JSON
- [ ] Responsive, mobile-first layout
- [ ] Accessible UI with semantic HTML

### Analytics
- [ ] Usage statistics dashboard
  - [ ] Most used prompts
  - [ ] Tag popularity
  - [ ] Usage frequency
  - [ ] Success rates
- [ ] Prompt performance metrics
  - [ ] Response quality ratings
  - [ ] Average response time
  - [ ] User feedback collection

### Testing
- [ ] Prompt testing interface
  - [ ] Real-time testing environment
  - [ ] Sample data integration
  - [ ] Response visualization
  - [ ] Test history tracking
- [ ] A/B testing capabilities
  - [ ] Multiple prompt versions
  - [ ] Performance comparison
  - [ ] Results analysis

### Settings
- [ ] User preferences
  - [ ] Theme selection
  - [ ] Default prompt settings
  - [ ] Export/import preferences
- [ ] Data management
  - [ ] Backup/restore
  - [ ] Storage limits
  - [ ] Data retention policies

### Technical
- [ ] Frontend-only (HTML, CSS, JS)
- [ ] No frameworks (Vanilla JS preferred)
- [ ] Modular JS structure
- [ ] Minimal CSS using Flexbox or CSS Grid
- [ ] Deployed to GitHub Pages

---

## 🔧 Architecture

### Application Shell
```
<app-shell>
  <header role="banner">
    <nav role="navigation" aria-label="Main navigation">
      <ul>
        <li><a href="#prompts">Prompts</a></li>
        <li><a href="#analytics">Analytics</a></li>
        <li><a href="#testing">Testing</a></li>
        <li><a href="#settings">Settings</a></li>
      </ul>
    </nav>
  </header>
  
  <main role="main">
    <section id="prompts" aria-labelledby="prompts-heading">
      <h1 id="prompts-heading">Prompt Management</h1>
      <!-- Prompt management content -->
    </section>
    
    <section id="analytics" aria-labelledby="analytics-heading" hidden>
      <h1 id="analytics-heading">Analytics Dashboard</h1>
      <!-- Analytics content -->
    </section>
    
    <section id="testing" aria-labelledby="testing-heading" hidden>
      <h1 id="testing-heading">Prompt Testing</h1>
      <!-- Testing content -->
    </section>
    
    <section id="settings" aria-labelledby="settings-heading" hidden>
      <h1 id="settings-heading">Settings</h1>
      <!-- Settings content -->
    </section>
  </main>
  
  <footer role="contentinfo">
    <!-- Footer content -->
  </footer>
</app-shell>
```

### File Structure
```
project-root/
├── src/
│   ├── components/
│   │   ├── app-shell/
│   │   │   ├── app-shell.js
│   │   │   ├── app-shell.css
│   │   │   └── app-shell.test.js
│   │   ├── navigation/
│   │   │   ├── navigation.js
│   │   │   ├── navigation.css
│   │   │   └── navigation.test.js
│   │   ├── prompt-editor/
│   │   │   ├── prompt-editor.js
│   │   │   ├── prompt-editor.css
│   │   │   └── prompt-editor.test.js
│   │   ├── prompt-list/
│   │   ├── analytics-dashboard/
│   │   ├── testing-interface/
│   │   └── settings-panel/
│   ├── services/
│   │   ├── storage.js
│   │   ├── analytics.js
│   │   └── testing.js
│   ├── utils/
│   │   ├── validation.js
│   │   └── helpers.js
│   └── app.js
├── public/
│   ├── index.html
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   └── styles/
│       ├── global.css
│       └── layout.css
├── build/
│   └── scripts/
│       └── build.js
├── docs/ (for GitHub Pages deployment)
├── package.json
├── vite.config.js
└── README.md
```

### Navigation & Routing
- Client-side routing using History API
- Semantic HTML for navigation structure
- ARIA landmarks for accessibility
- Progressive enhancement for navigation
- Keyboard navigation support
- Focus management between sections
- Skip links for keyboard users

### Accessibility Features
- Semantic HTML structure
- ARIA roles and labels
- Keyboard navigation
- Focus management
- Screen reader support
- High contrast mode
- Reduced motion preferences
- Form validation and error messages
- Skip links
- Proper heading hierarchy

### Build Process
- Use Vite for development and production builds
- Development:
  - Hot module replacement
  - Source maps
  - Development server
- Production:
  - Minification
  - Tree-shaking
  - Asset optimization
  - Build output to `/docs` for GitHub Pages
- Build scripts:
  - `npm run dev` - Start development server
  - `npm run build` - Create production build
  - `npm run test` - Run test suite
  - `npm run deploy` - Build and deploy to GitHub Pages

### Web Components Architecture
- Custom Elements for major UI components
- Shadow DOM for component isolation
- HTML Templates for component structure
- CSS Custom Properties for theming
- Event-based communication between components
- Component lifecycle management
- Progressive enhancement support

---

## 🔮 Test-Driven Development

### Framework
- Use [Vitest](https://vitest.dev/) or a minimal alternative (e.g., uvu, basic assert runner)
- Tests must be written before implementing new features
- Run tests in browser or via Node.js

### Test Coverage Goals
- [ ] All logic functions covered (create, read, update, delete, tag, import/export)
- [ ] Validate storage read/write behavior
- [ ] UI elements trigger correct app behavior
- [ ] Analytics data collection and processing
- [ ] Testing functionality validation
- [ ] Settings persistence and application
- [ ] Error handling and edge cases
- [ ] Accessibility compliance
- [ ] Navigation and routing behavior
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility

---

## 📉 Deployment
- Static site hosted via GitHub Pages
- Deployment target: `/docs` folder or `gh-pages` branch
- Optional: GitHub Actions for CI/CD

---

## 🌟 Stretch Goals
- [ ] Dark mode toggle
- [ ] Tag suggestions / autocomplete
- [ ] Bulk prompt import/export
- [ ] Reorder prompts (drag & drop or up/down)
- [ ] Collaborative prompt editing
- [ ] Prompt templates
- [ ] Advanced analytics visualization
- [ ] API integration for external services

---

## 🚀 MVP Goals
- Launch fully functional prompt manager with localStorage, tag support, and JSON I/O
- Follow TDD approach for all core logic
- Keep the app fast, lightweight, and easy to extend
- Implement basic analytics tracking
- Provide essential testing capabilities
- Ensure smooth user experience across all core features

