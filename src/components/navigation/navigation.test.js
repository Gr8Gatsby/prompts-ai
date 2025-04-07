import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Register the custom element before importing
if (!customElements.get('app-navigation')) {
  import('./navigation.js');
}

describe('app-navigation', () => {
  let element;
  let mediaQueryList;

  beforeEach(async () => {
    // Mock matchMedia
    mediaQueryList = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    window.matchMedia = vi.fn().mockReturnValue(mediaQueryList);

    // Wait for custom element to be defined
    await customElements.whenDefined('app-navigation');
    
    element = document.createElement('app-navigation');
    document.body.appendChild(element);
  });

  afterEach(() => {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
    vi.restoreAllMocks();
  });

  it('should render navigation links with icons', () => {
    const links = element.shadowRoot.querySelectorAll('a');
    expect(links.length).toBe(4);
    
    links.forEach(link => {
      const icon = link.querySelector('.material-symbols-rounded');
      expect(icon).not.toBeNull();
    });
  });

  it('should set initial page based on hash', () => {
    window.location.hash = '#testing';
    element.setupNavigation();
    
    const testingLink = element.shadowRoot.querySelector('a[data-page="testing"]');
    expect(testingLink.getAttribute('aria-current')).toBe('page');
  });

  it('should handle navigation events', () => {
    const analyticsLink = element.shadowRoot.querySelector('a[data-page="analytics"]');
    const navigationSpy = vi.fn();
    element.addEventListener('navigation', navigationSpy);
    
    analyticsLink.click();
    
    expect(navigationSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: { page: 'analytics' }
    }));
    expect(analyticsLink.getAttribute('aria-current')).toBe('page');
  });

  describe('mobile menu', () => {
    beforeEach(() => {
      // Mock mobile viewport before creating element
      mediaQueryList.matches = true;
      
      // Create element (which will use the mocked matchMedia)
      element = document.createElement('app-navigation');
      document.body.appendChild(element);
      
      // Ensure mobile detection is set up
      element.setupMobileDetection();
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
      const analyticsLink = element.shadowRoot.querySelector('a[data-page="analytics"]');
      
      // Open menu and navigate
      menuButton.click();
      analyticsLink.click();
      
      expect(menu.classList.contains('open')).toBe(false);
      expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    });
  });
}); 