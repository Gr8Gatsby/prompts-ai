# Prompt Management Web App (Frontend-Only)

A responsive, accessible, and deployable prompt management application built with TDD and hosted on GitHub Pages. The app follows macOS design principles to provide a native-like experience. Prompts are stored in the browser via `localStorage` and support tagging, importing/exporting, and clipboard copying.

---

## 🎨 UI/Design System

### Design Principles
- Follow macOS design language for a native app feel
- Prevent layout shifts during state changes
- Use subtle animations and transitions
- Support both light and dark modes
- Maintain consistent spacing and sizing
- Prioritize accessibility without compromising aesthetics

### Color System
- Light Mode:
  - Background: `#f5f5f5`
  - Text: `#333333`
  - Border: `#e0e0e0`
  - Accent: `#007aff`
  - Hover states: `rgba(0, 0, 0, 0.05)`
  - Active states: `rgba(0, 0, 0, 0.08)`

- Dark Mode:
  - Background: `#1c1c1e`
  - Text: `#ffffff`
  - Border: `#2c2c2e`
  - Accent: `#0a84ff`
  - Secondary text: `#8e8e93`
  - Hover states: `rgba(255, 255, 255, 0.05)`
  - Active states: `rgba(255, 255, 255, 0.08)`

### Typography
- System fonts: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif`
- Base font size: `14px`
- Letter spacing: `-0.01em` for headers
- Font weights: 
  - Regular: `400`
  - Medium: `500`
  - Semibold: `600`
- Text rendering: `-webkit-font-smoothing: antialiased`

### Components
- Navigation:
  - Height: `44px`
  - Item padding: `6px 12px`
  - Border radius: `6px`
  - Selected indicator: `2px` line with system accent color
  - Smooth transitions: `0.2s ease`

- Buttons:
  - Border radius: `6px`
  - Height: `32px`
  - Padding: `0 16px`
  - Hover/active states with subtle background changes
  - Icon + text alignment with `16px` spacing

- Cards/Panels:
  - Border radius: `8px`
  - Shadow: `0 1px 3px rgba(0,0,0,0.1)`
  - Background: Subtle contrast from main background
  - Padding: `16px`

- Forms:
  - Input height: `32px`
  - Border radius: `6px`
  - Focus states with system accent color
  - Label size: `12px`
  - Error states with system red

### Layout
- Maximum content width: `800px`
- Consistent spacing scale:
  - `4px` - Minimal spacing
  - `8px` - Component internal spacing
  - `16px` - Component margins
  - `24px` - Section spacing
  - `32px` - Large section spacing

### Animations
- Duration: `0.2s`
- Timing function: `ease`
- Properties to animate:
  - Background color
  - Transform
  - Opacity
  - Box shadow

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
- [ ] Modern macOS-like UI:
  - [ ] Native-like navigation
  - [ ] System-matched dark mode
  - [ ] Smooth transitions
  - [ ] No layout shifts
  - [ ] Consistent component styling

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
│   │   ├── router/
│   │   │   ├── router.js
│   │   │   ├── router.css
│   │   │   └── router.test.js
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
│   │   │   ├── prompt-list.js
│   │   │   ├── prompt-list.css
│   │   │   └── prompt-list.test.js
│   │   ├── analytics-dashboard/
│   │   │   ├── analytics-dashboard.js
│   │   │   ├── analytics-dashboard.css
│   │   │   └── analytics-dashboard.test.js
│   │   ├── testing-interface/
│   │   │   ├── testing-interface.js
│   │   │   ├── testing-interface.css
│   │   │   └── testing-interface.test.js
│   │   └── settings-panel/
│   │       ├── settings-panel.js
│   │       ├── settings-panel.css
│   │       └── settings-panel.test.js
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

### Component Architecture

#### Router Component
- Client-side routing implementation
- Route configuration and management
- Navigation state handling
- Route guards and authentication (if needed)
- Route transition animations
- Route-based code splitting
- Nested route support
- Route parameter handling

#### App Shell
- Main application container
- Layout management
- Theme provider
- Global state management
- Responsive layout handling
- Error boundary implementation

#### Navigation
- Main navigation menu
- Responsive navigation handling
- Active state management
- Keyboard navigation support
- Mobile menu implementation
- Navigation state persistence

#### Prompt Editor
- Rich text editing capabilities
- Tag management
- Sample data integration
- Auto-save functionality
- Version history
- Export/import functionality
- Real-time preview

#### Prompt List
- Grid/list view options
- Search and filtering
- Sorting capabilities
- Bulk actions
- Tag-based filtering
- Pagination/infinite scroll
- Selection management

#### Analytics Dashboard
- Real-time usage statistics
- Performance metrics visualization
- Custom report generation
- Data export capabilities
- Usage trends analysis
- Prompt performance tracking
- User engagement metrics

#### Testing Interface
- Real-time prompt testing
- Response visualization
- Test history tracking
- Performance metrics
- A/B testing capabilities
- Test result comparison
- Error handling and reporting

#### Settings Panel
- User preferences management
- Theme configuration
- Data import/export
- Backup/restore functionality
- Storage management
- Notification preferences
- Privacy settings

### Component Communication
- Event-based communication between components
- State management patterns
- Component lifecycle management
- Error boundary implementation
- Performance optimization strategies
- Data flow management
- Component composition patterns

### Navigation & Routing
- Dedicated router component for route management
- Route configuration and validation
- Route transition animations
- Route-based code splitting
- Nested route support
- Route parameter handling
- Route guards and authentication (if needed)
- Navigation state persistence
- Browser history integration
- Route change events and hooks
- Dynamic route loading
- Error handling for invalid routes
- Route metadata support
- Navigation progress indicators
- Scroll position restoration
- Route preloading strategies

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

