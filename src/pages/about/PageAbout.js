export class PageAbout extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.#render()
  }

  #render() {
    this.shadowRoot.innerHTML = `
      <style>
        .about {
          max-width: 500px;
          margin: 0 auto;
        }
        .about h2 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 16px;
          color: var(--text-primary, #333);
        }
        .about p {
          font-size: 14px;
          line-height: 1.6;
          color: var(--text-secondary, #555);
          margin-bottom: 12px;
        }
        .about ul {
          padding-left: 20px;
          margin-bottom: 12px;
        }
        .about li {
          font-size: 14px;
          color: var(--text-secondary, #555);
          margin-bottom: 4px;
        }
      </style>
      <div class="about">
        <h2>About This App</h2>
        <p>
          A vanilla JavaScript Todo application built with
          Web Components and Shadow DOM. No frameworks, no
          build-time dependencies for the UI layer.
        </p>
        <p>Built with:</p>
        <ul>
          <li>Web Components (Custom Elements, Shadow DOM)</li>
          <li>Custom router for client-side navigation</li>
          <li>Vite for development and bundling</li>
          <li>Vitest + Playwright for testing</li>
        </ul>
      </div>
    `
  }
}

customElements.define('page-about', PageAbout)
