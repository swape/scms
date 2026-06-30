export class EditorWrapper extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<div class="editor-wrapper">
  <page-list></page-list> 
  <page-preview></page-preview>
  <page-settings></page-settings>
</div>`
  }
}
