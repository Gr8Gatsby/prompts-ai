import { StyleLoader } from '../services/style-loader.js';

export class BaseComponent extends HTMLElement {
  constructor() {
    super();
  }

  attachShadowAndInjectStyles() {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    StyleLoader.injectThemeVariables(shadowRoot);
    return shadowRoot;
  }
} 