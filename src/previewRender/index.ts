import { getStorage, saveStorage } from '../localstorage.ts'
import type { ContentType } from '../types/types.ts'
import { renderHeader } from './headerView.ts'
import { renderLink } from './linkView.ts'
import { applyExtraStylesAndHeadTags, applyPageStyles, applyProjectStyles } from './styles.ts'
import { renderText } from './textView.ts'

function renderAll(content: ContentType[]) {
  const renderTo = document.querySelector('main')
  const currentProject = getStorage('currentProject')

  if (!renderTo || !content) {
    return
  }
  const output: string[] = []
  const sortedContent = [...content].sort((a, b) => (a.order || 0) - (b.order || 0))

  if (sortedContent.length > 0) {
    for (const element of sortedContent) {
      if (element.type === 'header') {
        output.push(renderHeader(element))
        continue
      }

      if (element.type === 'text') {
        output.push(renderText(element))
        continue
      }

      if (element.type === 'link') {
        output.push(renderLink(element, currentProject))
        continue
      }
    }
  }
  renderTo.innerHTML = output.join('\n')
}

let selectedPage = getStorage('selectedPage')
let darkMode = getStorage('darkMode') ? true : false
applyExtraStylesAndHeadTags()
applyProjectStyles()

// listen to storage changes and update the page accordingly
window.addEventListener('storage', (event) => {
  if (event.key === 'selectedElement') {
    if (!event.newValue) {
      return
    }

    const selectedFromStorage = getStorage('selectedElement')
    markSelectedElement(selectedFromStorage?.id, selectedFromStorage?.type)
  }
  if (event.key === 'selectedPage') {
    selectedPage = getStorage('selectedPage')
    const selectedPageTextarea = document.getElementById('selectedPage') as HTMLTextAreaElement | null
    if (selectedPageTextarea) {
      selectedPageTextarea.value = JSON.stringify(selectedPage, null, 2)
    }
    applyPageStyles(selectedPage, darkMode)
    renderAll(selectedPage?.content ?? [])
  }
})

window.addEventListener('click', (event) => {
  event.preventDefault()
  // find the closest element with data-type attribute
  const target = event.target as HTMLElement
  const closestElement = target.closest('[data-type]') as HTMLElement

  if (!closestElement) {
    return
  }

  const type = closestElement.getAttribute('data-type')
  const id = closestElement.getAttribute('data-id')

  if (!type || !id) {
    return
  }

  if (selectedPage?.content?.length > 0) {
    const selectedElement = selectedPage.content.find((element: ContentType) => element.id === id && element.type === type)
    saveStorage('selectedElement', selectedElement)
  }

  markSelectedElement(id, type)
})

function markSelectedElement(selectedID: string, selectedType: string) {
  const allSelectedElements = document.querySelectorAll('[data-selected="true"]')
  for (const element of allSelectedElements) {
    element.removeAttribute('data-selected')
  }

  const elementInDOM = document.querySelector(`[data-type="${selectedType}"][data-id="${selectedID}"]`)
  if (elementInDOM) {
    elementInDOM.setAttribute('data-selected', 'true')
  }
}
