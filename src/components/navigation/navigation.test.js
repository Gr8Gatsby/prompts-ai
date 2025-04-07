import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './navigation.js';

describe('app-navigation', () => {
  let element;

  beforeEach(async () => {
    element = document.createElement('app-navigation');
    document.body.appendChild(element);
    // Wait for custom element to be defined and initialized
    await customElements.whenDefined('app-navigation');
  });

  afterEach(() => {
    element.remove();
  });

  it('should render navigation links', () => {
    const links = element.shadowRoot.querySelectorAll('a');
    expect(links.length).toBe(4);
    
    const expectedLinks = ['Prompts', 'Analytics', 'Testing', 'Settings'];
    links.forEach((link, index) => {
      expect(link.textContent).toBe(expectedLinks[index]);
    });
  });

  it('should set initial page based on hash', async () => {
    // Set hash and create new element
    window.location.hash = '#analytics';
    const navElement = document.createElement('app-navigation');
    document.body.appendChild(navElement);
    await customElements.whenDefined('app-navigation');

    const analyticsLink = navElement.shadowRoot.querySelector('a[data-page="analytics"]');
    expect(analyticsLink.getAttribute('aria-current')).toBe('page');
    
    navElement.remove();
    window.location.hash = '';
  });

  it('should emit navigation event when link is clicked', () => {
    let emittedDetail = null;
    element.addEventListener('navigation', (e) => {
      emittedDetail = e.detail;
    });

    const testingLink = element.shadowRoot.querySelector('a[data-page="testing"]');
    testingLink.click();

    expect(emittedDetail).not.toBeNull();
    expect(emittedDetail.page).toBe('testing');
  });

  it('should update aria-current when link is clicked', () => {
    const settingsLink = element.shadowRoot.querySelector('a[data-page="settings"]');
    settingsLink.click();

    expect(settingsLink.getAttribute('aria-current')).toBe('page');
    
    const otherLinks = Array.from(element.shadowRoot.querySelectorAll('a')).filter(link => link !== settingsLink);
    otherLinks.forEach(link => {
      expect(link.hasAttribute('aria-current')).toBe(false);
    });
  });
}); 