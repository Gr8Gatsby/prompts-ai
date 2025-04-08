import { describe, it, expect, beforeEach } from 'vitest';
import { StyleLoader } from './style-loader.js';

describe('StyleLoader', () => {
  let shadowRoot;

  beforeEach(() => {
    // Create a mock shadow root
    shadowRoot = {
      appendChild: vi.fn(),
      querySelector: vi.fn()
    };
  });

  describe('injectButtonStyles', () => {
    it('should inject button styles into shadow root', () => {
      StyleLoader.injectButtonStyles(shadowRoot);

      expect(shadowRoot.appendChild).toHaveBeenCalledTimes(1);
      const styleElement = shadowRoot.appendChild.mock.calls[0][0];
      
      // Verify style element was created
      expect(styleElement instanceof HTMLStyleElement).toBe(true);
      
      // Verify style content
      expect(styleElement.textContent).toContain('.btn {');
      expect(styleElement.textContent).toContain('.btn-primary {');
      expect(styleElement.textContent).toContain('.btn-secondary {');
      expect(styleElement.textContent).toContain('.btn-small {');
      expect(styleElement.textContent).toContain('.btn-large {');
    });

    it('should include hover and active states', () => {
      StyleLoader.injectButtonStyles(shadowRoot);

      const styleElement = shadowRoot.appendChild.mock.calls[0][0];
      
      // Verify hover states
      expect(styleElement.textContent).toContain('.btn-primary:hover:not(:disabled)');
      expect(styleElement.textContent).toContain('.btn-secondary:hover:not(:disabled)');
      
      // Verify active states
      expect(styleElement.textContent).toContain('.btn-primary:active:not(:disabled)');
      expect(styleElement.textContent).toContain('.btn-secondary:active:not(:disabled)');
    });

    it('should include disabled state styles', () => {
      StyleLoader.injectButtonStyles(shadowRoot);

      const styleElement = shadowRoot.appendChild.mock.calls[0][0];
      expect(styleElement.textContent).toContain('.btn:disabled {');
    });
  });

  describe('injectCardStyles', () => {
    it('should inject card styles into shadow root', () => {
      StyleLoader.injectCardStyles(shadowRoot);

      expect(shadowRoot.appendChild).toHaveBeenCalledTimes(1);
      const styleElement = shadowRoot.appendChild.mock.calls[0][0];
      
      // Verify style element was created
      expect(styleElement instanceof HTMLStyleElement).toBe(true);
      
      // Verify style content
      expect(styleElement.textContent).toContain('.card {');
      expect(styleElement.textContent).toContain('.card-hover:hover {');
    });

    it('should include proper card styling properties', () => {
      StyleLoader.injectCardStyles(shadowRoot);

      const styleElement = shadowRoot.appendChild.mock.calls[0][0];
      
      // Verify basic card styles
      expect(styleElement.textContent).toContain('background: #1a1a1a');
      expect(styleElement.textContent).toContain('border-radius: 12px');
      expect(styleElement.textContent).toContain('border: 1px solid rgba(255, 255, 255, 0.1)');
      
      // Verify hover effect styles
      expect(styleElement.textContent).toContain('transform: translateY(-2px)');
      expect(styleElement.textContent).toContain('box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2)');
    });
  });
}); 