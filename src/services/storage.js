/**
 * Storage service for managing prompts and associated data using IndexedDB
 */
class StorageService {
  constructor() {
    this.DB_NAME = 'promptsDB';
    this.DB_VERSION = 1;
    this.db = null;
    this.initPromise = null;
    this.isTest = process.env.NODE_ENV === 'test';
  }

  /**
   * Log error if not in test environment
   * @private
   */
  logError(message, error) {
    if (!this.isTest) {
      console.error(message, error);
    }
  }

  /**
   * Initialize the IndexedDB database and create object stores
   * @returns {Promise<void>}
   */
  async initializeDB() {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      try {
        // Close existing connection if any
        if (this.db) {
          this.db.close();
          this.db = null;
        }

        const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

        request.onerror = (event) => {
          this.logError('Database error:', event.target.error);
          reject(event.target.error);
        };

        request.onupgradeneeded = (event) => {
          const db = event.target.result;

          // Create object stores if they don't exist
          if (!db.objectStoreNames.contains('prompts')) {
            const promptStore = db.createObjectStore('prompts', { keyPath: 'id', autoIncrement: true });
            promptStore.createIndex('title', 'title', { unique: false });
            promptStore.createIndex('tags', 'tags', { unique: false, multiEntry: true });
            promptStore.createIndex('createdAt', 'createdAt', { unique: false });
          }

          if (!db.objectStoreNames.contains('files')) {
            const fileStore = db.createObjectStore('files', { keyPath: 'id', autoIncrement: true });
            fileStore.createIndex('promptId', 'promptId', { unique: false });
            fileStore.createIndex('type', 'type', { unique: false });
          }

          if (!db.objectStoreNames.contains('examples')) {
            const exampleStore = db.createObjectStore('examples', { keyPath: 'id', autoIncrement: true });
            exampleStore.createIndex('promptId', 'promptId', { unique: false });
          }
        };

        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve();
        };
      } catch (error) {
        this.logError('Failed to initialize database:', error);
        reject(error);
      }
    });

    return this.initPromise;
  }

  /**
   * Create a new prompt
   * @param {Object} prompt - The prompt object to create
   * @param {string} prompt.title - Title of the prompt
   * @param {string} prompt.content - Content of the prompt
   * @param {string[]} prompt.tags - Array of tags
   * @param {File[]} [prompt.files] - Optional array of associated files
   * @param {Object[]} [prompt.examples] - Optional array of examples
   * @returns {Promise<number>} The ID of the created prompt
   */
  async createPrompt(prompt) {
    await this.ensureDB();
    
    const transaction = this.db.transaction(['prompts', 'files', 'examples'], 'readwrite');
    const promptStore = transaction.objectStore('prompts');
    const fileStore = transaction.objectStore('files');
    const exampleStore = transaction.objectStore('examples');

    try {
      // Add the prompt
      const promptData = {
        ...prompt,
        createdAt: new Date(),
        updatedAt: new Date(),
        files: [], // Store file references
        examples: [] // Store example references
      };
      
      const promptId = await new Promise((resolve, reject) => {
        const request = promptStore.add(promptData);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      // Store files if any
      if (prompt.files?.length) {
        for (const file of prompt.files) {
          const fileData = {
            promptId,
            name: file.name,
            type: file.type,
            data: file,
            createdAt: new Date()
          };
          await new Promise((resolve, reject) => {
            const request = fileStore.add(fileData);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
          });
        }
      }

      // Store examples if any
      if (prompt.examples?.length) {
        for (const example of prompt.examples) {
          const exampleData = {
            promptId,
            ...example,
            createdAt: new Date()
          };
          await new Promise((resolve, reject) => {
            const request = exampleStore.add(exampleData);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
          });
        }
      }

      return promptId;
    } catch (error) {
      this.logError('Failed to create prompt:', error);
      transaction.abort();
      throw error;
    }
  }

  /**
   * Get a prompt by ID including its files and examples
   * @param {number} id - The prompt ID
   * @returns {Promise<Object>} The prompt object with its files and examples
   */
  async getPrompt(id) {
    await this.ensureDB();
    
    const transaction = this.db.transaction(['prompts', 'files', 'examples'], 'readonly');
    const promptStore = transaction.objectStore('prompts');
    const fileStore = transaction.objectStore('files');
    const exampleStore = transaction.objectStore('examples');

    try {
      // Get the prompt
      const prompt = await new Promise((resolve, reject) => {
        const request = promptStore.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      if (!prompt) {
        throw new Error('Prompt not found');
      }

      // Get associated files
      const fileIndex = fileStore.index('promptId');
      prompt.files = await new Promise((resolve, reject) => {
        const request = fileIndex.getAll(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      // Get associated examples
      const exampleIndex = exampleStore.index('promptId');
      prompt.examples = await new Promise((resolve, reject) => {
        const request = exampleIndex.getAll(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      return prompt;
    } catch (error) {
      this.logError('Failed to get prompt:', error);
      throw error;
    }
  }

  /**
   * Update an existing prompt
   * @param {number} id - The prompt ID
   * @param {Object} updates - The fields to update
   * @returns {Promise<void>}
   */
  async updatePrompt(id, updates) {
    await this.ensureDB();
    
    const transaction = this.db.transaction(['prompts'], 'readwrite');
    const promptStore = transaction.objectStore('prompts');

    try {
      const prompt = await new Promise((resolve, reject) => {
        const request = promptStore.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      if (!prompt) {
        throw new Error('Prompt not found');
      }

      const updatedPrompt = {
        ...prompt,
        ...updates,
        updatedAt: new Date()
      };

      await new Promise((resolve, reject) => {
        const request = promptStore.put(updatedPrompt);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      this.logError('Failed to update prompt:', error);
      transaction.abort();
      throw error;
    }
  }

  /**
   * Delete a prompt and its associated data
   * @param {number} id - The prompt ID
   * @returns {Promise<void>}
   */
  async deletePrompt(id) {
    await this.ensureDB();
    
    const transaction = this.db.transaction(['prompts', 'files', 'examples'], 'readwrite');
    const promptStore = transaction.objectStore('prompts');
    const fileStore = transaction.objectStore('files');
    const exampleStore = transaction.objectStore('examples');

    try {
      // Delete associated files
      const fileIndex = fileStore.index('promptId');
      const fileKeys = await new Promise((resolve, reject) => {
        const request = fileIndex.getAllKeys(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      for (const key of fileKeys) {
        await new Promise((resolve, reject) => {
          const request = fileStore.delete(key);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }

      // Delete associated examples
      const exampleIndex = exampleStore.index('promptId');
      const exampleKeys = await new Promise((resolve, reject) => {
        const request = exampleIndex.getAllKeys(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      for (const key of exampleKeys) {
        await new Promise((resolve, reject) => {
          const request = exampleStore.delete(key);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }

      // Delete the prompt
      await new Promise((resolve, reject) => {
        const request = promptStore.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      this.logError('Failed to delete prompt:', error);
      transaction.abort();
      throw error;
    }
  }

  /**
   * Search prompts by title or tags
   * @param {Object} options - Search options
   * @param {string} [options.query] - Search query for title
   * @param {string[]} [options.tags] - Tags to filter by
   * @returns {Promise<Array>} Array of matching prompts
   */
  async searchPrompts({ query, tags } = {}) {
    await this.ensureDB();
    
    const transaction = this.db.transaction(['prompts'], 'readonly');
    const promptStore = transaction.objectStore('prompts');

    try {
      const allPrompts = await new Promise((resolve, reject) => {
        const request = promptStore.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      return allPrompts.filter(prompt => {
        const matchesQuery = !query || 
          prompt.title.toLowerCase().includes(query.toLowerCase()) ||
          prompt.content.toLowerCase().includes(query.toLowerCase());
        
        const matchesTags = !tags?.length ||
          tags.every(tag => prompt.tags.includes(tag));

        return matchesQuery && matchesTags;
      });
    } catch (error) {
      this.logError('Failed to search prompts:', error);
      throw error;
    }
  }

  /**
   * Ensure database is initialized
   * @private
   * @returns {Promise<void>}
   */
  async ensureDB() {
    if (!this.db) {
      await this.initializeDB();
      // Wait for initialization to complete
      await this.initPromise;
    }
  }
}

// Export a singleton instance
const storage = new StorageService();

// Initialize the database immediately
storage.initializeDB().catch(console.error);

export { storage }; 