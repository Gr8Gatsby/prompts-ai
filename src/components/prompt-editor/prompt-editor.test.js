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
      id: 123, // Use numeric ID
      title: 'Test Prompt',
      content: 'Test Content',
      tags: ['test']
    };

    storageService.getPrompt.mockResolvedValue(mockPrompt);
    
    // Set the attribute BEFORE appending to DOM
    element.setAttribute('prompt-id', '123');
    document.body.appendChild(element);
    
    // Wait for the storage service to be called
    await vi.waitFor(() => {
      expect(storageService.getPrompt).toHaveBeenCalledWith(123); // Pass numeric ID
    });

    // Check the form values
    const titleInput = element.shadowRoot.querySelector('#title');
    const contentInput = element.shadowRoot.querySelector('#content');
    expect(titleInput.value).toBe(mockPrompt.title);
    expect(contentInput.value).toBe(mockPrompt.content);
  });

  it('should validate form inputs', () => {
    document.body.appendChild(element);
    const titleInput = element.shadowRoot.querySelector('#title');
    const contentInput = element.shadowRoot.querySelector('#content');
    const saveButton = element.shadowRoot.querySelector('.save-button');
    const titleError = element.shadowRoot.querySelector('#title-error');
    const contentError = element.shadowRoot.querySelector('#content-error');

    // Initially both fields are empty
    expect(saveButton.disabled).toBe(true);
    expect(titleError.classList.contains('visible')).toBe(true);
    expect(contentError.classList.contains('visible')).toBe(true);

    // Fill in title only
    titleInput.value = 'Test Title';
    titleInput.dispatchEvent(new Event('input'));
    expect(titleError.classList.contains('visible')).toBe(false);
    expect(contentError.classList.contains('visible')).toBe(true);
    expect(saveButton.disabled).toBe(true);

    // Fill in content too
    contentInput.value = 'Test Content';
    contentInput.dispatchEvent(new Event('input'));
    expect(titleError.classList.contains('visible')).toBe(false);
    expect(contentError.classList.contains('visible')).toBe(false);
    expect(saveButton.disabled).toBe(false);
  });

  it('should handle tag addition and removal', () => {
    document.body.appendChild(element);
    const tagInput = element.shadowRoot.querySelector('.tag-input');
    
    // Add a tag
    tagInput.value = 'test-tag';
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    
    const tag = element.shadowRoot.querySelector('.tag');
    expect(tag).toBeTruthy();
    // Use a more flexible assertion for the tag text
    expect(tag.textContent.replace(/\s+/g, '')).toBe('test-tag×');
    
    // Remove the tag
    const removeButton = element.shadowRoot.querySelector('.tag-remove');
    removeButton.click();
    
    const removedTag = element.shadowRoot.querySelector('.tag');
    expect(removedTag).toBeFalsy();
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

  it('should handle cancel action', () => {
    document.body.appendChild(element);
    const cancelSpy = vi.fn();
    element.addEventListener('cancel-edit', cancelSpy);

    const cancelButton = element.shadowRoot.querySelector('.cancel-button');
    cancelButton.click();

    expect(cancelSpy).toHaveBeenCalled();
    expect(element.prompt).toEqual({ title: '', content: '', tags: [] });
  });
}); 