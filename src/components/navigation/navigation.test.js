import { beforeEach, describe, expect, it, vi } from 'vitest';

// Register the custom element before importing
if (!customElements.get('app-navigation')) {
  import('./navigation.js');
}

describe('app-navigation', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('app-navigation');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should render navigation links with icons', () => {
    const links = element.shadowRoot.querySelectorAll('a');
    expect(links.length).toBe(4);
    
    links.forEach(link => {
      expect(link.querySelector('.material-symbols-rounded')).not.toBeNull();
    });
  });

  it('should set initial active state based on pathname', () => {
    // Mock window.location.pathname
    Object.defineProperty(window, 'location', {
      value: { pathname: '/analytics' },
      writable: true
    });

    // Create new element to test initial state
    const newElement = document.createElement('app-navigation');
    document.body.appendChild(newElement);

    const analyticsLink = newElement.shadowRoot.querySelector('a[href="/analytics"]');
    expect(analyticsLink.getAttribute('aria-current')).toBe('page');

    document.body.removeChild(newElement);
  });

  it('should handle navigation events', () => {
    const spy = vi.spyOn(document, 'dispatchEvent');
    const testingLink = element.shadowRoot.querySelector('a[href="/testing"]');
    
    testingLink.click();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'navigate',
        detail: { page: 'testing' }
      })
    );

    expect(testingLink.getAttribute('aria-current')).toBe('page');
  });

  describe('mobile menu', () => {
    beforeEach(() => {
      // Mock mobile viewport
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: true,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }));

      // Recreate element with mobile viewport
      document.body.removeChild(element);
      element = document.createElement('app-navigation');
      document.body.appendChild(element);
    });

    it('should show menu button on mobile', () => {
      const menuButton = element.shadowRoot.querySelector('.menu-button');
      expect(menuButton.style.display).toBe('flex');
    });

    it('should toggle menu on button click', () => {
      const menuButton = element.shadowRoot.querySelector('.menu-button');
      const menu = element.shadowRoot.querySelector('ul');

      menuButton.click();
      expect(menu.classList.contains('open')).toBe(true);
      expect(menuButton.getAttribute('aria-expanded')).toBe('true');

      menuButton.click();
      expect(menu.classList.contains('open')).toBe(false);
      expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    });

    it('should close menu when clicking outside', () => {
      const menuButton = element.shadowRoot.querySelector('.menu-button');
      const menu = element.shadowRoot.querySelector('ul');

      // Open menu
      menuButton.click();
      expect(menu.classList.contains('open')).toBe(true);

      // Click outside
      document.body.click();
      expect(menu.classList.contains('open')).toBe(false);
      expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    });

    it('should close menu after navigation', () => {
      const menuButton = element.shadowRoot.querySelector('.menu-button');
      const menu = element.shadowRoot.querySelector('ul');
      const link = element.shadowRoot.querySelector('a');

      // Open menu
      menuButton.click();
      expect(menu.classList.contains('open')).toBe(true);

      // Click link
      link.click();
      expect(menu.classList.contains('open')).toBe(false);
      expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    });
  });
}); 