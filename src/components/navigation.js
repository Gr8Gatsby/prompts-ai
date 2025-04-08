import { BaseComponent } from './base-component.js';

export class Navigation extends BaseComponent {
  constructor() {
    super();
    const shadowRoot = this.attachShadowAndInjectStyles();
    // ... existing code ...
  }
} 