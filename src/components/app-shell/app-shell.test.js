import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './app-shell.js';

describe('app-shell', () => {
  let element;

  beforeEach(async () => {
    element = document.createElement('app-shell');
    document.body.appendChild(element);
    // Wait for element to be ready
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  afterEach(() => {
    element.remove();
  });

  it('should render all sections', () => {
    const sections = element.querySelectorAll('section');
    expect(sections.length).toBe(4);
    
    const expectedSections = ['prompts', 'analytics', 'testing', 'settings'];
    sections.forEach((section, index) => {
      expect(section.id).toBe(expectedSections[index]);
    });
  });

  it('should show prompts section by default', () => {
    const promptsSection = element.querySelector('#prompts');
    expect(promptsSection.getAttribute('aria-current')).toBe('page');
    
    const otherSections = Array.from(element.querySelectorAll('section')).filter(section => section.id !== 'prompts');
    otherSections.forEach(section => {
      expect(section.hasAttribute('aria-current')).toBe(false);
    });
  });

  it('should handle navigation events', () => {
    const event = new CustomEvent('navigation', {
      detail: { page: 'testing' },
      bubbles: true,
      composed: true
    });
    
    element.querySelector('app-navigation').dispatchEvent(event);
    
    const testingSection = element.querySelector('#testing');
    expect(testingSection.getAttribute('aria-current')).toBe('page');
    
    const otherSections = Array.from(element.querySelectorAll('section')).filter(section => section.id !== 'testing');
    otherSections.forEach(section => {
      expect(section.hasAttribute('aria-current')).toBe(false);
    });
  });

  it('should maintain section visibility when navigation occurs', () => {
    // Navigate to analytics
    element.querySelector('app-navigation').dispatchEvent(new CustomEvent('navigation', {
      detail: { page: 'analytics' },
      bubbles: true,
      composed: true
    }));

    // Check analytics is visible
    const analyticsSection = element.querySelector('#analytics');
    expect(analyticsSection.getAttribute('aria-current')).toBe('page');

    // Navigate to settings
    element.querySelector('app-navigation').dispatchEvent(new CustomEvent('navigation', {
      detail: { page: 'settings' },
      bubbles: true,
      composed: true
    }));

    // Check settings is visible and analytics is hidden
    const settingsSection = element.querySelector('#settings');
    expect(settingsSection.getAttribute('aria-current')).toBe('page');
    expect(analyticsSection.hasAttribute('aria-current')).toBe(false);
  });
}); 