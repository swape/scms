import { EditorWrapper } from './EditorWrapper'
import { PageList } from './PageList'
import { PagePreview } from './PagePreview'
import { PageSettings } from './PageSettings'

export default function initiateEditor() {
  if (!customElements.get('editor-wrapper')) {
    customElements.define('editor-wrapper', EditorWrapper)
  }
  if (!customElements.get('page-list')) {
    customElements.define('page-list', PageList)
  }
  if (!customElements.get('page-settings')) {
    customElements.define('page-settings', PageSettings)
  }
  if (!customElements.get('page-preview')) {
    customElements.define('page-preview', PagePreview)
  }
}

// TODO: fetch the project from localstorage and load it into the editor
// TODO: save the changes to the project into localstorage
// TODO: use Proxy to detect changes and save them automatically
// TODO: add resizable (dragable) sidebars for pages (left) and component settings (right)
// TODO: make the visual editor in the middle to preview the page and select components
// add parts on its own file and import them here
