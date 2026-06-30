import { onSelectedPageChange, type EditorPageType } from './structure'

export class PagePreview extends HTMLElement {
  private unsubscribe: (() => void) | null = null

  private render(page: EditorPageType | null): void {
    this.innerHTML = `<div class="page-preview">The page preview ${page ? page.title : '(none)'}</div>`
  }

  connectedCallback() {
    console.log('PagePreview connected')
    this.unsubscribe = onSelectedPageChange((page) => {
      this.render(page)
    })
  }

  disconnectedCallback() {
    this.unsubscribe?.()
    this.unsubscribe = null
  }
}
