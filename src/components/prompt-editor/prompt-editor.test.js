import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './prompt-editor.js';
import { StorageService } from '../../services/storage.js';

// Mock the StorageService
vi.mock('../../services/storage.js', () => ({
  StorageService: vi.fn().mockImplementation(() => ({
    getPrompt: vi.fn(),
    createPrompt: vi.fn(),
    updatePrompt: vi.fn()
  }))
}));

describe('prompt-editor', () => {
  let element;
  let storageService;

  beforeEach(async () => {
    // Create a new instance of the component
    element = document.createElement('prompt-editor');
    document.body.appendChild(element);
    
    // Wait for custom element to be ready
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    // Get the mocked storage service instance
    storageService = element.storageService;
  });

  afterEach(() => {
    document.body.removeChild(element);
    vi.clearAllMocks();
  });

  it('should render the editor form', () => {
    const form = element.shadowRoot.querySelector('.prompt-form');
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
      id: '123',
      title: 'Test Prompt',
      content: 'Test Content',
      tags: ['test', 'prompt']
    };
    
    storageService.getPrompt.mockResolvedValue(mockPrompt);
    
    element.setAttribute('prompt-id', '123');
    await element.loadPrompt('123');
    
    const titleInput = element.shadowRoot.querySelector('#title');
    const contentInput = element.shadowRoot.querySelector('#content');
    
    expect(titleInput.value).toBe(mockPrompt.title);
    expect(contentInput.value).toBe(mockPrompt.content);
    expect(element.prompt.tags).toEqual(mockPrompt.tags);
  });

  it('should validate form inputs', () => {
    const titleInput = element.shadowRoot.querySelector('#title');
    const contentInput = element.shadowRoot.querySelector('#content');
    const saveButton = element.shadowRoot.querySelector('.save-button');
    const titleError = element.shadowRoot.querySelector('#title-error');
    const contentError = element.shadowRoot.querySelector('#content-error');
    
    // Initially, save button should be disabled
    expect(saveButton.disabled).toBe(true);
    
    // Fill in only title
    titleInput.value = 'Test Title';
    titleInput.dispatchEvent(new Event('input'));
    
    expect(saveButton.disabled).toBe(true);
    expect(titleError.classList.contains('visible')).toBe(false);
    expect(contentError.classList.contains('visible')).toBe(true);
    
    // Fill in content
    contentInput.value = 'Test Content';
    contentInput.dispatchEvent(new Event('input'));
    
    expect(saveButton.disabled).toBe(false);
    expect(titleError.classList.contains('visible')).toBe(false);
    expect(contentError.classList.contains('visible')).toBe(false);
  });

  it('should handle tag addition and removal', () => {
    const tagInput = element.shadowRoot.querySelector('.tag-input');
    
    // Add a tag
    tagInput.value = 'test-tag';
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    
    expect(element.prompt.tags).toContain('test-tag');
    
    // Remove the tag
    const removeButton = element.shadowRoot.querySelector('.tag-remove');
    removeButton.click();
    
    expect(element.prompt.tags).not.toContain('test-tag');
  });

  it('should save a new prompt', async () => {
    const mockPrompt = {
      title: 'New Prompt',
      content: 'New Content',
      tags: ['new']
    };
    
    storageService.createPrompt.mockResolvedValue('123');
    
    const form = element.shadowRoot.querySelector('.prompt-form');
    const titleInput = element.shadowRoot.querySelector('#title');
    const contentInput = element.shadowRoot.querySelector('#content');
    const tagInput = element.shadowRoot.querySelector('.tag-input');
    
    // Fill in the form
    titleInput.value = mockPrompt.title;
    contentInput.value = mockPrompt.content;
    tagInput.value = mockPrompt.tags[0];
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    
    // Submit the form
    form.dispatchEvent(new Event('submit'));
    
    // Wait for the save operation
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(storageService.createPrompt).toHaveBeenCalledWith(expect.objectContaining({
      title: mockPrompt.title,
      content: mockPrompt.content,
      tags: mockPrompt.tags
    }));
  });

  it('should show save confirmation', async () => {
    const form = element.shadowRoot.querySelector('.prompt-form');
    const titleInput = element.shadowRoot.querySelector('#title');
    const contentInput = element.shadowRoot.querySelector('#content');
    const saveConfirmation = element.shadowRoot.querySelector('.save-confirmation');
    
    // Fill in the form
    titleInput.value = 'Test Title';
    contentInput.value = 'Test Content';
    
    // Submit the form
    form.dispatchEvent(new Event('submit'));
    
    // Wait for the save operation
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(saveConfirmation.classList.contains('visible')).toBe(true);
  });

  it('should handle cancel action', () => {
    const cancelButton = element.shadowRoot.querySelector('.cancel-button');
    const originalPrompt = { title: 'Original', content: 'Content', tags: ['tag'] };
    
    element.setPrompt(originalPrompt);
    
    // Change some values
    const titleInput = element.shadowRoot.querySelector('#title');
    titleInput.value = 'Changed Title';
    
    // Click cancel
    cancelButton.click();
    
    expect(element.prompt.title).toBe(originalPrompt.title);
  });
}); 