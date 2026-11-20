<script lang="ts">
import { onDestroy } from 'svelte'
import Input from '../../components/Input.svelte'
import { currentProject, selectedElement, selectedPage } from '../../store.ts'
import type { BlockEditorProps, PageType } from '../../types/types.ts'
import { createPendingSave } from '../../utils/editor-save.ts'
import ColorSelect from '../shared/ColorSelect.svelte'

const { activeTab = 'content' }: BlockEditorProps = $props()

function isPage(element: NonNullable<typeof $selectedElement>): element is PageType {
  return 'parentId' in element
}

function getPageOrder(): number | '' {
  const element = $selectedElement

  return element && isPage(element) ? element.order : ''
}

const pendingSave = createPendingSave(300)
let pendingElement: PageType | null = null
let pendingChanges: Partial<Pick<PageType, 'title' | 'order'>> = {}

const unsubscribeSelection = selectedElement.subscribe((element) => {
  if (pendingElement && element !== pendingElement) {
    pendingSave.flush()
  }
})

onDestroy(() => {
  unsubscribeSelection()
  pendingSave.flush()
})

function updatePage(changes: typeof pendingChanges) {
  const project = $currentProject
  const element = $selectedElement
  if (!project || !element || element.type !== 'page' || !isPage(element)) {
    return
  }
  const page = project.pages.find((candidate) => candidate.id === element.id)
  if (!page) {
    return
  }

  pendingElement = element
  pendingChanges = { ...pendingChanges, ...changes }
  const editedFields = pendingChanges
  selectedElement.update((selected) => {
    Object.assign(element, changes)
    return selected
  })

  pendingSave.schedule(() => {
    pendingElement = null
    pendingChanges = {}
    const current = $currentProject
    if (current?.id !== project.id || !current.pages.includes(page)) {
      return
    }

    const updatedPage = { ...page, ...editedFields }
    currentProject.set({ ...current, pages: current.pages.map((candidate) => (candidate === page ? updatedPage : candidate)) })
    if ($selectedPage?.id === page.id) {
      selectedPage.set(updatedPage)
    }
  })
}

function updateTitle(event: Event) {
  const input = event.target as HTMLInputElement
  updatePage({ title: input.value.slice(0, 100) })
}

function updateOrder(event: Event) {
  const input = event.target as HTMLInputElement
  updatePage({ order: Number.parseInt(input.value, 10) || 0 })
}
</script>

<div hidden={activeTab !== 'content'}>
  <Input id="title" label="Title:" value={$selectedElement?.title || ''} oninput={updateTitle} />
</div>

<div hidden={activeTab !== 'style'}>
  <ColorSelect title="Page background color" id="page-background-color" styleName="backgroundColorKey" isBgColors={true} />
  <ColorSelect title="Page text color" id="page-text-color" styleName="textColorKey" isBgColors={false} />
</div>

<div hidden={activeTab !== 'other'}>
  <Input id="order" label="Order:" value={getPageOrder()} oninput={updateOrder} />
</div>
