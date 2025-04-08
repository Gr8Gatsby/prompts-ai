import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { StorageService } from './storage.js';

// Mock indexedDB
const mockIndexedDB = {
  open: () => {
    const request = {
      result: {
        objectStoreNames: {
          contains: () => false
        },
        createObjectStore: () => ({
          createIndex: () => {}
        }),
        transaction: () => ({
          objectStore: () => ({
            add: () => ({ result: 1 }),
            get: () => ({ result: null }),
            getAll: () => ({ result: [] }),
            put: () => ({ result: undefined }),
            delete: () => ({ result: undefined }),
            index: () => ({
              getAll: () => ({ result: [] }),
              getAllKeys: () => ({ result: [] })
            })
          })
        }),
        close: () => {}
      },
      onerror: null,
      onsuccess: null,
      onupgradeneeded: null
    };

    setTimeout(() => {
      request.onupgradeneeded?.({ target: request });
      request.onsuccess?.({ target: request });
    });

    return request;
  }
};

// Set up the mock IndexedDB environment
global.indexedDB = mockIndexedDB;

describe('StorageService', () => {
  let service;

  beforeEach(() => {
    service = new StorageService();
  });

  afterEach(() => {
    service.db?.close();
  });

  describe('createPrompt', () => {
    it('should create a prompt with basic data', async () => {
      const promptData = {
        title: 'Test Prompt',
        content: 'Test content',
        tags: ['test', 'example']
      };

      const id = await service.createPrompt(promptData);
      expect(id).toBeDefined();

      const savedPrompt = await service.getPrompt(id);
      expect(savedPrompt).toMatchObject({
        title: promptData.title,
        content: promptData.content,
        tags: promptData.tags
      });
      expect(savedPrompt.createdAt).toBeInstanceOf(Date);
      expect(savedPrompt.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a prompt with files', async () => {
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const promptData = {
        title: 'Test Prompt',
        content: 'Test content',
        tags: ['test'],
        files: [file]
      };

      const id = await service.createPrompt(promptData);
      const savedPrompt = await service.getPrompt(id);
      
      expect(savedPrompt.files).toHaveLength(1);
      expect(savedPrompt.files[0]).toMatchObject({
        name: 'test.txt',
        type: 'text/plain'
      });
    });

    it('should create a prompt with examples', async () => {
      const promptData = {
        title: 'Test Prompt',
        content: 'Test content',
        tags: ['test'],
        examples: [{
          input: 'Example input',
          output: 'Example output'
        }]
      };

      const id = await service.createPrompt(promptData);
      const savedPrompt = await service.getPrompt(id);
      
      expect(savedPrompt.examples).toHaveLength(1);
      expect(savedPrompt.examples[0]).toMatchObject({
        input: 'Example input',
        output: 'Example output'
      });
    });
  });

  describe('getPrompt', () => {
    it('should throw error for non-existent prompt', async () => {
      await expect(service.getPrompt(999)).rejects.toThrow('Prompt not found');
    });

    it('should retrieve a prompt with all associated data', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const promptData = {
        title: 'Test Prompt',
        content: 'Test content',
        tags: ['test'],
        files: [file],
        examples: [{
          input: 'Example input',
          output: 'Example output'
        }]
      };

      const id = await service.createPrompt(promptData);
      const savedPrompt = await service.getPrompt(id);

      expect(savedPrompt).toMatchObject({
        title: promptData.title,
        content: promptData.content,
        tags: promptData.tags
      });
      expect(savedPrompt.files).toHaveLength(1);
      expect(savedPrompt.examples).toHaveLength(1);
    });
  });

  describe('updatePrompt', () => {
    it('should update prompt fields', async () => {
      const promptData = {
        title: 'Original Title',
        content: 'Original content',
        tags: ['original']
      };

      const id = await service.createPrompt(promptData);
      const updates = {
        title: 'Updated Title',
        tags: ['updated']
      };

      await service.updatePrompt(id, updates);
      const updatedPrompt = await service.getPrompt(id);

      expect(updatedPrompt).toMatchObject({
        title: updates.title,
        content: promptData.content, // Unchanged
        tags: updates.tags
      });
      expect(updatedPrompt.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw error when updating non-existent prompt', async () => {
      await expect(service.updatePrompt(999, { title: 'New' }))
        .rejects.toThrow('Prompt not found');
    });
  });

  describe('deletePrompt', () => {
    it('should delete prompt and all associated data', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const promptData = {
        title: 'Test Prompt',
        content: 'Test content',
        tags: ['test'],
        files: [file],
        examples: [{
          input: 'Example input',
          output: 'Example output'
        }]
      };

      const id = await service.createPrompt(promptData);
      await service.deletePrompt(id);

      await expect(service.getPrompt(id)).rejects.toThrow('Prompt not found');
    });
  });

  describe('searchPrompts', () => {
    beforeEach(async () => {
      // Create test prompts
      await service.createPrompt({
        title: 'First Prompt',
        content: 'Content one',
        tags: ['tag1', 'common']
      });
      await service.createPrompt({
        title: 'Second Prompt',
        content: 'Content two',
        tags: ['tag2', 'common']
      });
    });

    it('should search prompts by title', async () => {
      const results = await service.searchPrompts({ query: 'First' });
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('First Prompt');
    });

    it('should search prompts by content', async () => {
      const results = await service.searchPrompts({ query: 'two' });
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Second Prompt');
    });

    it('should search prompts by tags', async () => {
      const results = await service.searchPrompts({ tags: ['tag1'] });
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('First Prompt');
    });

    it('should search prompts by multiple tags', async () => {
      const results = await service.searchPrompts({ tags: ['common'] });
      expect(results).toHaveLength(2);
    });

    it('should return all prompts when no search criteria', async () => {
      const results = await service.searchPrompts();
      expect(results).toHaveLength(2);
    });

    it('should return empty array when no matches', async () => {
      const results = await service.searchPrompts({ query: 'nonexistent' });
      expect(results).toHaveLength(0);
    });
  });
}); 