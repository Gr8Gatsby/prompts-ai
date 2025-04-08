import { StyleLoader } from '../../services/style-loader.js';
import { BaseComponent } from '../base-component.js';

export class AnalyticsDashboard extends BaseComponent {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          color: #ffffff;
        }

        .dashboard {
          max-width: var(--content-width);
          margin: 0 auto;
        }

        .card {
          background: #1a1a1a;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .card-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          color: white;
        }

        .metrics {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .metric-card {
          background: #252525;
          border-radius: 8px;
          padding: 16px;
          display: flex;
          flex-direction: column;
        }

        .metric-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
        }

        .metric-value {
          font-size: 24px;
          font-weight: 600;
          color: white;
        }

        .chart-container {
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #252525;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .chart-placeholder {
          color: rgba(255, 255, 255, 0.5);
          font-size: 16px;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
        }

        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .icon {
          width: 18px;
          height: 18px;
          fill: currentColor;
        }
      </style>

      <div class="dashboard">
        <div class="card">
          <div class="card-title">Prompt Usage Analytics</div>
          
          <div class="metrics">
            <div class="metric-card">
              <div class="metric-label">Total Prompts</div>
              <div class="metric-value">24</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Total Uses</div>
              <div class="metric-value">312</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">This Month</div>
              <div class="metric-value">87</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Average Length</div>
              <div class="metric-value">127</div>
            </div>
          </div>
          
          <div class="chart-container">
            <div class="chart-placeholder">Usage data visualization would appear here</div>
          </div>
          
          <div class="actions">
            <button class="btn btn-secondary refresh-btn">
              <svg class="icon" viewBox="0 0 24 24">
                <path d="M17.65 6.35a7.95 7.95 0 0 0-6.15-2.85c-4.42 0-8 3.58-8 8s3.58 8 8 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 11.5 17.5c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 10h7V3l-2.35 3.35z"/>
              </svg>
              Refresh Data
            </button>
            <button class="btn btn-primary">Export Report</button>
          </div>
        </div>
      </div>
    `;
    
    // Inject the button styles into the shadow DOM
    StyleLoader.injectButtonStyles(this.shadowRoot);
  }

  setupEventListeners() {
    const refreshButton = this.shadowRoot.querySelector('.refresh-btn');
    refreshButton.addEventListener('click', () => {
      // In a real app, this would fetch new data
      console.log('Refreshing analytics data...');
      this.showRefreshAnimation(refreshButton);
    });
  }

  showRefreshAnimation(button) {
    const icon = button.querySelector('.icon');
    icon.style.transition = 'transform 0.5s ease';
    icon.style.transform = 'rotate(360deg)';
    
    setTimeout(() => {
      icon.style.transform = 'rotate(0)';
    }, 500);
  }
}

customElements.define('analytics-dashboard', AnalyticsDashboard); 