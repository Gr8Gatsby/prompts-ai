import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './navigation.js';

describe('app-navigation', () => {
  let element;
  let originalPushState;
  let originalPathname;

  beforeEach(async () => {
    // Mock window.location
    originalPathname = window.location.pathname;
    Object.defineProperty(window.location, 'pathname', {
      value: '/prompts',
      writable: true
    });

    // Mock history.pushState
    originalPushState = window.history.pushState;
    window.history.pushState = vi.fn();

    element = document.createElement('app-navigation');
    document.body.appendChild(element);
    // Wait for custom element to be ready
    await new Promise(resolve => requestAnimationFrame(resolve));
  });

  afterEach(() => {
    document.body.removeChild(element);
    // Restore original implementations
    window.history.pushState = originalPushState;
    Object.defineProperty(window.location, 'pathname', {
      value: originalPathname,
      writable: true
    });
  });

  it('should render navigation links with icons', () => {
    const links = element.shadowRoot.querySelectorAll('nav a');
    expect(links.length).toBeGreaterThan(0);
    
    // Check that each link has an icon and text
    links.forEach(link => {
      expect(link.querySelector('svg')).toBeTruthy();
      expect(link.textContent.trim()).toBeTruthy();
    });
  });

  it('should set initial active state based on pathname', () => {
    const activeLink = element.shadowRoot.querySelector('a[aria-current="page"]');
    expect(activeLink).toBeTruthy();
    expect(activeLink.getAttribute('href')).toBe('/prompts');
  });

  it('should handle navigation events', () => {
    const links = element.shadowRoot.querySelectorAll('nav a');
    const firstLink = links[0];
    
    // Update pathname for the test
    Object.defineProperty(window.location, 'pathname', {
      value: '/prompts',
      writable: true
    });
    
    // Simulate click
    firstLink.click();
    
    // Check that navigation event was dispatched
    expect(firstLink.getAttribute('aria-current')).toBe('page');
    expect(window.history.pushState).toHaveBeenCalledWith({}, '', '/prompts');
  });

  describe('mobile menu', () => {
    beforeEach(() => {
      // Mock mobile viewport
      window.matchMedia = query => ({
        matches: query.includes('max-width'),
        addListener: () => {},
        removeListener: () => {}
      });
    });

    it('should show menu button on mobile', () => {
      const menuButton = element.shadowRoot.querySelector('.menu-button');
      expect(menuButton).toBeTruthy();
    });

    it('should toggle menu on button click', () => {
      const menuButton = element.shadowRoot.querySelector('.menu-button');
      const nav = element.shadowRoot.querySelector('nav');
      
      menuButton.click();
      expect(nav.classList.contains('visible')).toBe(true);
      
      menuButton.click();
      expect(nav.classList.contains('visible')).toBe(false);
    });

    it('should close menu when clicking outside', () => {
      const menuButton = element.shadowRoot.querySelector('.menu-button');
      const nav = element.shadowRoot.querySelector('nav');
      
      menuButton.click();
      expect(nav.classList.contains('visible')).toBe(true);
      
      document.body.click();
      expect(nav.classList.contains('visible')).toBe(false);
    });

    it('should close menu after navigation', () => {
      const menuButton = element.shadowRoot.querySelector('.menu-button');
      const nav = element.shadowRoot.querySelector('nav');
      const firstLink = nav.querySelector('a');
      
      menuButton.click();
      expect(nav.classList.contains('visible')).toBe(true);
      
      firstLink.click();
      expect(nav.classList.contains('visible')).toBe(false);
    });
  });
}); 