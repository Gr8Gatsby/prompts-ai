import { StyleLoader } from '../../services/style-loader.js';
import { BaseComponent } from '../base-component.js';

export class SettingsPanel extends BaseComponent {
  constructor() {
    super();
    const shadowRoot = this.attachShadowAndInjectStyles();
    this.settings = {
      darkMode: true,
      notifications: true,
      autoSave: true,
      fontSize: 'medium'
    };
    this.loadSettings();
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  loadSettings() {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
      this.applySettings();
    }
  }

  applySettings() {
    // Apply theme
    document.documentElement.setAttribute('data-theme', this.settings.darkMode ? 'dark' : 'light');
    
    // Apply font size
    document.documentElement.setAttribute('data-font-size', this.settings.fontSize);
  }

  getFontSizeValue() {
    return this.settings.fontSize;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          color: var(--text-primary);
        }

        .settings {
          max-width: var(--content-width);
          margin: 0 auto;
        }

        .card {
          background: var(--card-background);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          border: 1px solid var(--border-color);
        }

        .card-title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          margin-bottom: 24px;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
        }

        .settings-group {
          margin-bottom: 24px;
        }

        .setting-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .setting-label {
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-medium);
        }

        .setting-description {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          margin-top: 4px;
        }

        .toggle {
          position: relative;
          display: inline-block;
          width: 52px;
          height: 28px;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--button-secondary-bg);
          transition: .3s;
          border-radius: 28px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 4px;
          bottom: 4px;
          background-color: var(--text-primary);
          transition: .3s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: var(--button-primary-bg);
        }

        input:checked + .toggle-slider:before {
          transform: translateX(24px);
        }

        select {
          background: var(--input-background);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          padding: 8px 12px;
          border-radius: 6px;
          font-size: var(--font-size-sm);
          min-width: 120px;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 24px;
        }
      </style>

      <div class="settings">
        <div class="card">
          <div class="card-title">App Settings</div>
          
          <div class="settings-group">
            <div class="setting-row">
              <div>
                <div class="setting-label">Dark Mode</div>
                <div class="setting-description">Enable dark theme for the application</div>
              </div>
              <label class="toggle">
                <input type="checkbox" id="dark-mode" ${this.settings.darkMode ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="setting-row">
              <div>
                <div class="setting-label">Notifications</div>
                <div class="setting-description">Receive notifications about prompt updates</div>
              </div>
              <label class="toggle">
                <input type="checkbox" id="notifications" ${this.settings.notifications ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="setting-row">
              <div>
                <div class="setting-label">Auto Save</div>
                <div class="setting-description">Automatically save prompt drafts</div>
              </div>
              <label class="toggle">
                <input type="checkbox" id="auto-save" ${this.settings.autoSave ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="setting-row">
              <div>
                <div class="setting-label">Font Size</div>
                <div class="setting-description">Adjust the font size of the prompt editor</div>
              </div>
              <select id="font-size">
                <option value="small" ${this.settings.fontSize === 'small' ? 'selected' : ''}>Small</option>
                <option value="medium" ${this.settings.fontSize === 'medium' ? 'selected' : ''}>Medium</option>
                <option value="large" ${this.settings.fontSize === 'large' ? 'selected' : ''}>Large</option>
              </select>
            </div>
          </div>
          
          <div class="actions">
            <button class="btn btn-secondary">Reset to Default</button>
            <button class="btn btn-primary">Save Settings</button>
          </div>
        </div>
      </div>
    `;
    
    // Inject the button styles into the shadow DOM
    StyleLoader.injectButtonStyles(this.shadowRoot);
  }

  setupEventListeners() {
    const saveButton = this.shadowRoot.querySelector('.btn-primary');
    saveButton.addEventListener('click', () => {
      this.saveSettings();
    });
    
    const resetButton = this.shadowRoot.querySelector('.btn-secondary');
    resetButton.addEventListener('click', () => {
      this.resetSettings();
    });

    // Add change listeners for immediate feedback
    const darkModeToggle = this.shadowRoot.querySelector('#dark-mode');
    darkModeToggle.addEventListener('change', () => {
      this.settings.darkMode = darkModeToggle.checked;
      this.applySettings();
    });

    const fontSizeSelect = this.shadowRoot.querySelector('#font-size');
    fontSizeSelect.addEventListener('change', () => {
      this.settings.fontSize = fontSizeSelect.value;
      this.applySettings();
    });
  }

  saveSettings() {
    // Get all settings from form
    this.settings.darkMode = this.shadowRoot.querySelector('#dark-mode').checked;
    this.settings.notifications = this.shadowRoot.querySelector('#notifications').checked;
    this.settings.autoSave = this.shadowRoot.querySelector('#auto-save').checked;
    this.settings.fontSize = this.shadowRoot.querySelector('#font-size').value;
    
    // Save to localStorage
    localStorage.setItem('appSettings', JSON.stringify(this.settings));
    
    // Apply settings
    this.applySettings();
    
    // Show a success message
    this.showSaveConfirmation();
  }

  resetSettings() {
    // Reset to defaults
    this.settings = {
      darkMode: true,
      notifications: true,
      autoSave: true,
      fontSize: 'medium'
    };
    
    // Save to localStorage
    localStorage.setItem('appSettings', JSON.stringify(this.settings));
    
    // Apply settings
    this.applySettings();
    
    // Re-render with new settings
    this.render();
    this.setupEventListeners();
    
    console.log('Settings reset to defaults');
  }

  showSaveConfirmation() {
    const saveButton = this.shadowRoot.querySelector('.btn-primary');
    const originalText = saveButton.textContent;
    saveButton.textContent = 'Saved!';
    
    setTimeout(() => {
      saveButton.textContent = originalText;
    }, 2000);
  }
}

customElements.define('settings-panel', SettingsPanel); 