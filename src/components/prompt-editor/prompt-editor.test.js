import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './prompt-editor.js';
import { StorageService } from '../../services/storage.js';

// Mock the StorageService
vi.mock('../../services/storage.js', () => ({
  StorageService: vi.fn().mockImplementation(() => ({
    getPrompt: vi.fn(),
    createPrompt: vi.fn().mockResolvedValue(1), // Return a valid numeric ID
    updatePrompt: vi.fn()
  }))
}));

describe('prompt-editor', () => {
  let element;
  let storageService;

  beforeEach(() => {
    // Setup fake timers
    vi.useFakeTimers();
    
    // Create a new instance of the component
    element = document.createElement('prompt-editor');
    
    // Get the mocked storage service instance
    storageService = element.storageService;
  });

  afterEach(() => {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should render the editor form', () => {
    document.body.appendChild(element);
    const form = element.shadowRoot.querySelector('#prompt-form');
    const titleInput = element.shadowRoot.querySelector('#title');
    const contentInput = element.shadowRoot.querySelector('#content');
    const tagInput = element.shadowRoot.querySelector('.tag-input');
    
    expect(form).toBeTruthy();
    expect(titleInput).toBeTruthy();
    expect(contentInput).toBeTruthy();
    expect(tagInput).toBeTruthy();
  });

  it('should load a prompt when prompt-id attribute is set', async () => {
    const mockPrompt = {
      id: 123,
      title: 'Test Prompt',
      content: 'Test Content',
      tags: ['test']
    };

    // Setup the mock before setting attribute
    storageService.getPrompt.mockResolvedValue(mockPrompt);
    
    // Set the attribute and append to DOM
    element.setAttribute('prompt-id', '123');
    document.body.appendChild(element);
    
    // Wait for the loadPrompt method to be called
    await vi.waitFor(() => {
      expect(storageService.getPrompt).toHaveBeenCalledWith('123');
    });

    // Wait for the component to update with the loaded prompt
    await vi.waitFor(() => {
      const titleInput = element.shadowRoot.querySelector('#title');
      const contentInput = element.shadowRoot.querySelector('#content');
      const tagElements = element.shadowRoot.querySelectorAll('.tag');
      
      expect(titleInput.value).toBe(mockPrompt.title);
      expect(contentInput.value).toBe(mockPrompt.content);
      expect(tagElements.length).toBe(1);
      expect(tagElements[0].textContent.replace(/[\s\n]+/g, '')).toBe('test×');
      expect(element.prompt).toEqual(mockPrompt);
    });
  });

  it('should validate form inputs', async () => {
    document.body.appendChild(element);
    
    // Get form elements
    const titleInput = element.shadowRoot.querySelector('#title');
    const contentInput = element.shadowRoot.querySelector('#content');
    const saveButton = element.shadowRoot.querySelector('.save-button');
    
    // Initially both fields are empty, trigger validation
    titleInput.dispatchEvent(new Event('input'));
    contentInput.dispatchEvent(new Event('input'));
    
    await vi.waitFor(() => {
      expect(saveButton.disabled).toBe(true);
      expect(titleInput.classList.contains('invalid')).toBe(true);
      expect(contentInput.classList.contains('invalid')).toBe(true);
    });

    // Fill in title only
    titleInput.value = 'Test Title';
    titleInput.dispatchEvent(new Event('input'));
    
    await vi.waitFor(() => {
      expect(titleInput.classList.contains('invalid')).toBe(false);
      expect(contentInput.classList.contains('invalid')).toBe(true);
      expect(saveButton.disabled).toBe(true);
    });

    // Fill in content too
    contentInput.value = 'Test Content';
    contentInput.dispatchEvent(new Event('input'));
    
    await vi.waitFor(() => {
      expect(titleInput.classList.contains('invalid')).toBe(false);
      expect(contentInput.classList.contains('invalid')).toBe(false);
      expect(saveButton.disabled).toBe(false);
    });
  });

  it('should handle tag addition and removal', async () => {
    document.body.appendChild(element);
    const tagInput = element.shadowRoot.querySelector('.tag-input');
    
    // Add a tag using space key (as implemented in the component)
    tagInput.value = 'test-tag';
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    
    // Wait for the tag to be added
    await vi.waitFor(() => {
      const tags = element.shadowRoot.querySelectorAll('.tag');
      expect(tags.length).toBe(1);
      expect(tags[0].textContent.replace(/[\s\n]+/g, '')).toBe('test-tag×');
      expect(element.prompt.tags).toContain('test-tag');
    });
    
    // Remove the tag
    const removeButton = element.shadowRoot.querySelector('.tag-remove');
    removeButton.click();
    
    // Wait for the tag to be removed
    await vi.waitFor(() => {
      const tags = element.shadowRoot.querySelectorAll('.tag');
      expect(tags.length).toBe(0);
      expect(element.prompt.tags).toHaveLength(0);
    });
  });

  it('should save a new prompt', async () => {
    document.body.appendChild(element);
    storageService.createPrompt.mockResolvedValue(1); // Return a valid numeric ID

    // Fill in the form
    const titleInput = element.shadowRoot.querySelector('#title');
    const contentInput = element.shadowRoot.querySelector('#content');
    const form = element.shadowRoot.querySelector('#prompt-form');

    titleInput.value = 'Test Title';
    contentInput.value = 'Test Content';
    
    // Trigger input events to enable save button
    titleInput.dispatchEvent(new Event('input'));
    contentInput.dispatchEvent(new Event('input'));

    // Setup event spy
    const saveSpy = vi.fn();
    element.addEventListener('prompt-saved', saveSpy);

    // Submit the form
    form.dispatchEvent(new Event('submit'));
    
    // Wait for the save operation
    await vi.waitFor(() => {
      expect(storageService.createPrompt).toHaveBeenCalledWith({
        title: 'Test Title',
        content: 'Test Content',
        tags: [],
        id: 1 // Add expected id field
      });
      expect(saveSpy).toHaveBeenCalled();
    });
  });

  it('should show save confirmation', async () => {
    document.body.appendChild(element);
    storageService.createPrompt.mockResolvedValue(1); // Return a valid numeric ID

    // Fill in the form
    const titleInput = element.shadowRoot.querySelector('#title');
    const contentInput = element.shadowRoot.querySelector('#content');
    const form = element.shadowRoot.querySelector('#prompt-form');
    const saveButton = element.shadowRoot.querySelector('.save-button');

    titleInput.value = 'Test Title';
    contentInput.value = 'Test Content';
    
    // Trigger input events to enable save button
    titleInput.dispatchEvent(new Event('input'));
    contentInput.dispatchEvent(new Event('input'));

    // Wait for validation to complete
    await vi.waitFor(() => {
      expect(saveButton.disabled).toBe(false);
    });

    // Submit the form
    form.dispatchEvent(new Event('submit'));
    
    // Wait for the save confirmation
    await vi.waitFor(() => {
      expect(saveButton.textContent).toBe('Saved!');
    });

    // Wait for the confirmation to disappear
    vi.advanceTimersByTime(3000);
    expect(saveButton.textContent).toBe('Save Prompt');
  });

  it('should handle cancel action', async () => {
    document.body.appendChild(element);
    
    // Setup spies
    const routeChangeSpy = vi.fn();
    const pushStateSpy = vi.spyOn(window.history, 'pushState');
    window.addEventListener('route-changed', routeChangeSpy);
    
    // Fill in some data first
    const titleInput = element.shadowRoot.querySelector('#title');
    const contentInput = element.shadowRoot.querySelector('#content');
    titleInput.value = 'Test Title';
    contentInput.value = 'Test Content';
    titleInput.dispatchEvent(new Event('input'));
    contentInput.dispatchEvent(new Event('input'));

    // Trigger cancel
    const cancelButton = element.shadowRoot.querySelector('.cancel-button');
    cancelButton.click();

    // Wait for state reset and route change
    await vi.waitFor(() => {
      // Verify route change event was dispatched
      expect(routeChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { path: '/prompts' }
        })
      );
      
      // Verify navigation occurred
      expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/prompts');
      
      // Verify form was cleared
      const updatedTitleInput = element.shadowRoot.querySelector('#title');
      const updatedContentInput = element.shadowRoot.querySelector('#content');
      expect(updatedTitleInput.value).toBe('');
      expect(updatedContentInput.value).toBe('');
      
      // Verify component state was reset
      expect(element.prompt).toEqual({ title: '', content: '', tags: [] });
    });

    // Cleanup
    window.removeEventListener('route-changed', routeChangeSpy);
    pushStateSpy.mockRestore();
  });
}); 