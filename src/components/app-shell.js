import { BaseComponent } from './base-component.js';

export class AppShell extends BaseComponent {
  constructor() {
    super();
    const shadowRoot = this.attachShadowAndInjectStyles();
    // ... existing code ...
  }
} 