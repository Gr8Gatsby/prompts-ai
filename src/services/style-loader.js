/**
 * StyleLoader - A utility to help Web Components load shared styles
 */
export class StyleLoader {
  /**
   * Injects shared button styles into a shadow DOM
   * @param {ShadowRoot} shadowRoot - The shadow root to inject styles into
   */
  static injectButtonStyles(shadowRoot) {
    const style = document.createElement('style');
    style.textContent = `
      /* Modern Button Styles */
      .btn {
        height: 44px;
        padding: 0 24px;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        white-space: nowrap;
        text-decoration: none;
        min-width: 120px;
        letter-spacing: 0.01em;
        border: none;
        position: relative;
        overflow: hidden;
      }

      .btn-primary {
        background: #6366f1;
        color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
      }

      .btn-primary:hover:not(:disabled) {
        background: #818cf8;
        transform: translateY(-1px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
      }

      .btn-primary:active:not(:disabled) {
        background: #4f46e5;
        transform: translateY(0);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      .btn-secondary {
        background: rgba(255, 255, 255, 0.05);
        color: #ffffff;
        border: 2px solid rgba(255, 255, 255, 0.1);
      }

      .btn-secondary:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);
      }

      .btn-secondary:active:not(:disabled) {
        transform: translateY(0);
        background: rgba(255, 255, 255, 0.05);
      }

      .btn-small {
        height: 36px;
        padding: 0 16px;
        min-width: 80px;
        font-size: 14px;
      }

      .btn-large {
        height: 48px;
        padding: 0 32px;
        min-width: 140px;
        font-size: 18px;
      }

      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
      }
    `;
    shadowRoot.appendChild(style);
  }

  /**
   * Injects card styles into a shadow DOM
   * @param {ShadowRoot} shadowRoot - The shadow root to inject styles into
   */
  static injectCardStyles(shadowRoot) {
    const style = document.createElement('style');
    style.textContent = `
      /* Modern Card Styles */
      .card {
        background: #1a1a1a;
        border-radius: 12px;
        padding: 20px;
        transition: all 0.2s ease;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .card-hover:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        border-color: rgba(255, 255, 255, 0.15);
      }
    `;
    shadowRoot.appendChild(style);
  }

  /**
   * Injects theme variables into a shadow DOM
   * @param {ShadowRoot} shadowRoot - The shadow root to inject styles into
   */
  static injectThemeVariables(shadowRoot) {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        /* Typography */
        --font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        --font-size-base: 16px;
        --font-size-xs: 12px;
        --font-size-sm: 14px;
        --font-size-md: 16px;
        --font-size-lg: 20px;
        --font-size-xl: 24px;
        --font-weight-normal: 400;
        --font-weight-medium: 500;
        --font-weight-semibold: 600;
        --font-weight-bold: 700;
        --line-height-tight: 1.2;
        --line-height-normal: 1.5;
        --line-height-relaxed: 1.75;
      }

      [data-font-size="small"] {
        --font-size-base: 14px;
        --font-size-xs: 10px;
        --font-size-sm: 12px;
        --font-size-md: 14px;
        --font-size-lg: 18px;
        --font-size-xl: 22px;
      }

      [data-font-size="medium"] {
        --font-size-base: 16px;
        --font-size-xs: 12px;
        --font-size-sm: 14px;
        --font-size-md: 16px;
        --font-size-lg: 20px;
        --font-size-xl: 24px;
      }

      [data-font-size="large"] {
        --font-size-base: 18px;
        --font-size-xs: 14px;
        --font-size-sm: 16px;
        --font-size-md: 18px;
        --font-size-lg: 22px;
        --font-size-xl: 26px;
      }
    `;
    shadowRoot.appendChild(style);
  }
} 