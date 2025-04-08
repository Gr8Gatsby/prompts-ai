import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { StorageService } from './storage.js';

// Mock indexedDB
const mockIndexedDB = {
  open: (name, version) => {
    const request = {
      result: {
        objectStoreNames: {
          contains: () => false
        },
        createObjectStore: (name, options) => ({
          createIndex: () => {}
        }),
        transaction: () => ({
          objectStore: () => ({
            add: () => {
              const addRequest = {
                onerror: null,
                onsuccess: null,
                result: 1
              };
              setTimeout(() => {
                if (addRequest.onsuccess) {
                  addRequest.onsuccess({ target: addRequest });
                }
              }, 0);
              return addRequest;
            },
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
      onupgradeneeded: null,
      error: null
    };

    setTimeout(() => {
      if (request.onupgradeneeded) {
        request.onupgradeneeded({ target: request });
      }
      if (request.onsuccess) {
        request.onsuccess({ target: request });
      }
    }, 0);

    return request;
  }
};

// Set up the mock IndexedDB environment
global.indexedDB = mockIndexedDB;

describe('StorageService', () => {
  let service;

  beforeEach(() => {
    // Ensure we're in test mode
    process.env.NODE_ENV = 'test';
    service = new StorageService();
  });

  afterEach(() => {
    service.db?.close();
    // Reset test mode
    process.env.NODE_ENV = 'test';
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

  describe('getAllPrompts', () => {
    it('should return empty array when no prompts exist', async () => {
      const prompts = await service.getAllPrompts();
      expect(prompts).toEqual([]);
    });

    it('should return all prompts in the store', async () => {
      // Create test prompts
      const prompt1 = {
        title: 'First Prompt',
        content: 'Content one',
        tags: ['tag1']
      };
      const prompt2 = {
        title: 'Second Prompt',
        content: 'Content two',
        tags: ['tag2']
      };

      await service.createPrompt(prompt1);
      await service.createPrompt(prompt2);

      const prompts = await service.getAllPrompts();
      expect(prompts).toHaveLength(2);
      expect(prompts[0].title).toBe('First Prompt');
      expect(prompts[1].title).toBe('Second Prompt');
    });
  });

  describe('error handling', () => {
    it('should handle database initialization failure', async () => {
      const originalOpen = indexedDB.open;
      indexedDB.open = () => {
        const request = {
          error: new Error('Failed to open database'),
          onerror: null,
          onsuccess: null
        };
        
        // Trigger error immediately
        setTimeout(() => {
          if (request.onerror) {
            request.onerror({ target: request });
          }
        }, 0);
        
        return request;
      };

      const newService = new StorageService();
      await expect(newService.initializeDB()).rejects.toThrow('Failed to open database');

      indexedDB.open = originalOpen;
    });

    it('should handle transaction failures', async () => {
      const promptData = {
        title: 'Test Prompt',
        content: 'Test content',
        tags: ['test']
      };

      // Override the test mode behavior to simulate a transaction failure
      const originalIsTest = service.isTest;
      service.isTest = false; // Temporarily disable test mode to use IndexedDB mock

      const originalDB = service.db;
      service.db = {
        transaction: () => {
          const transaction = {
            objectStore: () => ({
              add: () => {
                const request = {
                  onerror: null,
                  onsuccess: null,
                  error: new Error('Transaction failed')
                };
                // Trigger error immediately
                setTimeout(() => {
                  if (request.onerror) {
                    request.onerror({ 
                      target: request,
                      error: new Error('Transaction failed')
                    });
                  }
                }, 0);
                return request;
              }
            }),
            abort: () => {}
          };
          return transaction;
        },
        close: () => {}
      };

      await expect(service.createPrompt(promptData)).rejects.toThrow('Transaction failed');

      // Restore original state
      service.db = originalDB;
      service.isTest = originalIsTest;
    });
  });

  describe('database initialization', () => {
    it('should initialize database only once', async () => {
      const originalOpen = indexedDB.open;
      let openCount = 0;
      
      indexedDB.open = () => {
        openCount++;
        const request = {
          result: {
            objectStoreNames: { contains: () => true },
            transaction: () => ({
              objectStore: () => ({})
            }),
            close: () => {}
          },
          onerror: null,
          onsuccess: null
        };
        
        // Trigger success immediately
        setTimeout(() => {
          if (request.onsuccess) {
            request.onsuccess({ target: request });
          }
        }, 0);
        
        return request;
      };

      await service.initializeDB();
      await service.initializeDB();

      expect(openCount).toBe(1);
      
      indexedDB.open = originalOpen;
    });

    it('should create required object stores', async () => {
      const stores = [];
      const mockDB = {
        objectStoreNames: {
          contains: (name) => false
        },
        createObjectStore: (name, options) => {
          stores.push(name);
          return {
            createIndex: () => {}
          };
        },
        close: () => {}
      };

      const request = {
        result: mockDB,
        onerror: null,
        onsuccess: null,
        onupgradeneeded: null
      };

      const originalOpen = indexedDB.open;
      indexedDB.open = () => {
        // Trigger upgrade first, then success
        setTimeout(() => {
          if (request.onupgradeneeded) {
            request.onupgradeneeded({ target: request });
          }
          if (request.onsuccess) {
            request.onsuccess({ target: request });
          }
        }, 0);
        return request;
      };

      const newService = new StorageService();
      await newService.initializeDB();

      expect(stores).toContain('prompts');
      expect(stores).toContain('files');
      expect(stores).toContain('examples');

      indexedDB.open = originalOpen;
    });
  });

  describe('searchPrompts with complex criteria', () => {
    beforeEach(async () => {
      await service.createPrompt({
        title: 'AI Prompt',
        content: 'Generate creative stories',
        tags: ['ai', 'writing', 'creative']
      });
      await service.createPrompt({
        title: 'Code Review',
        content: 'AI code review assistant',
        tags: ['ai', 'coding', 'review']
      });
      await service.createPrompt({
        title: 'Writing Helper',
        content: 'Improve your writing',
        tags: ['writing', 'grammar']
      });
    });

    it('should find prompts matching both query and tags', async () => {
      const results = await service.searchPrompts({
        query: 'ai',
        tags: ['writing']
      });

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('AI Prompt');
    });

    it('should handle case-insensitive search', async () => {
      const results = await service.searchPrompts({
        query: 'CODE'
      });

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Code Review');
    });

    it('should match content text', async () => {
      const results = await service.searchPrompts({
        query: 'creative stories'
      });

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('AI Prompt');
    });

    it('should require all specified tags', async () => {
      const results = await service.searchPrompts({
        tags: ['ai', 'coding']
      });

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Code Review');
    });
  });
}); 