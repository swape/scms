<script lang="ts">
import Input from '../../components/Input.svelte'
import { currentProject, selectedElement, selectedPage } from '../../store.ts'
import type { BlockEditorProps, PageType } from '../../types/types.ts'
import ColorSelect from '../shared/ColorSelect.svelte'

const {}: BlockEditorProps = $props()

function isPage(element: NonNullable<typeof $selectedElement>): element is PageType {
  return 'parentId' in element
}

function getPageOrder(): number | '' {
  const element = $selectedElement

  return element && isPage(element) ? element.order : ''
}

function updateTitle(event: Event) {
  const input = event.target as HTMLInputElement
  selectedElement.update((element) => {
    if (element) {
      // limit the title to 100 characters
      const newTitle = input.value.slice(0, 100)
      element.title = newTitle
    }
    updatePageWithDebounce()
    return element
  })
}

function updateOrder(event: Event) {
  const input = event.target as HTMLInputElement
  selectedElement.update((element) => {
    if (element && isPage(element)) {
      element.order = Number.parseInt(input.value, 10) || 0
    }
    updatePageWithDebounce()
    return element
  })
}

// update the project's page with debounced input
let debounceTimeout: ReturnType<typeof setTimeout>

function updatePageWithDebounce() {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    currentProject.update((project) => {
      if (project?.pages && $selectedElement) {
        const pageIndex = project.pages.findIndex((page: PageType) => page.id === $selectedElement.id)
        if (pageIndex !== -1 && $selectedElement.type === 'page' && isPage($selectedElement)) {
          project.pages[pageIndex] = { ...$selectedElement }
          selectedPage.set($selectedElement)
        }
      }
      return project
    })
  }, 300)
}

function updateBackgroundColorKey(event: Event) {
  const select = event.target as HTMLSelectElement
  selectedElement.update((element) => {
    if (element) {
      const page = element as PageType
      page.colors = { textColorKey: page.colors?.textColorKey || '', backgroundColorKey: select.value }
    }
    updatePageWithDebounce()
    return element
  })
}

function updateTextColorKey(event: Event) {
  const select = event.target as HTMLSelectElement
  selectedElement.update((element) => {
    if (element) {
      const page = element as PageType
      page.colors = { textColorKey: select.value, backgroundColorKey: page.colors?.backgroundColorKey || '' }
    }
    updatePageWithDebounce()
    return element
  })
}
</script>

<Input id="title" label="Title:" value={$selectedElement?.title || ''} oninput={updateTitle} />
<Input id="order" label="Order:" value={getPageOrder()} oninput={updateOrder} />

<ColorSelect
  element={{ style: { backgroundColorKey: ($selectedElement as PageType)?.colors?.backgroundColorKey || '' } }}
  title="Page background color"
  id="page-background-color"
  styleName="backgroundColorKey"
  update={updateBackgroundColorKey}
  isBgColors={true} />
<ColorSelect
  element={{ style: { textColorKey: ($selectedElement as PageType)?.colors?.textColorKey || '' } }}
  title="Page text color"
  id="page-text-color"
  styleName="textColorKey"
  update={updateTextColorKey}
  isBgColors={false} />
