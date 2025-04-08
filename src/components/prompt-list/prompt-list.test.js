import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './prompt-list.js';
import { StorageService } from '../../services/storage.js';

// Mock the StorageService
vi.mock('../../services/storage.js', () => ({
  StorageService: vi.fn().mockImplementation(() => ({
    getAllPrompts: vi.fn()
  }))
}));

describe('prompt-list', () => {
  let element;
  let storageService;

  beforeEach(async () => {
    // Create a new instance of the component
    element = document.createElement('prompt-list');
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

  it('should render the list container and create button', () => {
    const container = element.shadowRoot.querySelector('.prompt-list');
    const header = element.shadowRoot.querySelector('.header');
    const createButton = element.shadowRoot.querySelector('.create-button');
    const promptsGrid = element.shadowRoot.querySelector('.prompts');
    
    expect(container).toBeTruthy();
    expect(header).toBeTruthy();
    expect(createButton).toBeTruthy();
    expect(promptsGrid).toBeTruthy();
  });

  it('should load and display prompts', async () => {
    const mockPrompts = [
      {
        id: '1',
        title: 'Test Prompt 1',
        content: 'Test Content 1',
        tags: ['test', 'prompt1']
      },
      {
        id: '2',
        title: 'Test Prompt 2',
        content: 'Test Content 2',
        tags: ['test', 'prompt2']
      }
    ];
    
    storageService.getAllPrompts.mockResolvedValue(mockPrompts);
    
    await element.loadPrompts();
    
    const promptCards = element.shadowRoot.querySelectorAll('.prompt-card');
    expect(promptCards.length).toBe(2);
    
    // Check first prompt card
    const firstCard = promptCards[0];
    expect(firstCard.dataset.id).toBe('1');
    expect(firstCard.querySelector('.prompt-title').textContent).toBe('Test Prompt 1');
    expect(firstCard.querySelector('.prompt-preview').textContent).toBe('Test Content 1');
    expect(firstCard.querySelectorAll('.tag').length).toBe(2);
  });

  it('should display empty state when no prompts', async () => {
    storageService.getAllPrompts.mockResolvedValue([]);
    
    await element.loadPrompts();
    
    const emptyState = element.shadowRoot.querySelector('div[style*="grid-column: 1 / -1"]');
    expect(emptyState).toBeTruthy();
    expect(emptyState.textContent).toContain('No prompts yet');
  });

  it('should display error state when loading fails', async () => {
    storageService.getAllPrompts.mockRejectedValue(new Error('Failed to load'));
    
    await element.loadPrompts();
    
    const errorMessage = element.shadowRoot.querySelector('.error-message');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain('Failed to load prompts');
  });

  it('should dispatch edit-prompt event when prompt card is clicked', async () => {
    const mockPrompts = [{
      id: '1',
      title: 'Test Prompt',
      content: 'Test Content',
      tags: ['test']
    }];
    
    storageService.getAllPrompts.mockResolvedValue(mockPrompts);
    await element.loadPrompts();
    
    const editPromptHandler = vi.fn();
    document.addEventListener('edit-prompt', editPromptHandler);
    
    const promptCard = element.shadowRoot.querySelector('.prompt-card');
    promptCard.click();
    
    expect(editPromptHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { promptId: '1' }
      })
    );
    document.removeEventListener('edit-prompt', editPromptHandler);
  });

  it('should reload prompts when prompt-saved event is received', async () => {
    const mockPrompts = [{
      id: '1',
      title: 'Test Prompt',
      content: 'Test Content',
      tags: ['test']
    }];
    
    storageService.getAllPrompts.mockResolvedValue(mockPrompts);
    
    // Initial load
    await element.loadPrompts();
    
    // Clear mock calls
    storageService.getAllPrompts.mockClear();
    
    // Dispatch prompt-saved event
    document.dispatchEvent(new CustomEvent('prompt-saved'));
    
    // Wait for the event to be processed
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(storageService.getAllPrompts).toHaveBeenCalled();
  });

  it('should escape HTML in prompt content', async () => {
    const mockPrompts = [{
      id: '1',
      title: '<script>alert("xss")</script>',
      content: '<div>Test Content</div>',
      tags: ['<test>']
    }];
    
    storageService.getAllPrompts.mockResolvedValue(mockPrompts);
    await element.loadPrompts();
    
    const promptCard = element.shadowRoot.querySelector('.prompt-card');
    expect(promptCard.querySelector('.prompt-title').innerHTML).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
    expect(promptCard.querySelector('.prompt-preview').innerHTML).toBe('&lt;div&gt;Test Content&lt;/div&gt;');
    expect(promptCard.querySelector('.tag').innerHTML).toBe('&lt;test&gt;');
  });
}); 