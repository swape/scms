// @ts-nocheck
import { getStorage, saveStorage } from '../localstorage.ts'
import type { ContentType } from '../types/types.ts'
import { renderHeader } from './headerView.ts'
import { renderLink } from './linkView.ts'
import { renderText } from './textView.ts'

function renderAll(content: ContentType[]) {
  const renderTo = document.querySelector('main')
  const currentProject = getStorage('currentProject')

  if (!renderTo || !content || content.length === 0) {
    return
  }
  const output: string[] = []

  for (const element of content) {
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
  renderTo.innerHTML = output.join('\n')
}

let selectedPage = getStorage('selectedPage')
let darkMode = getStorage('darkMode') ? true : false

// listen to storage changes and update the page accordingly
window.addEventListener('storage', (event) => {
  if (event.key === 'selectedElement') {
    const selectedFromStorage = JSON.parse(event.newValue)
    const selectedElementTextarea = document.getElementById('selectedElement')
    selectedElementTextarea.value = JSON.stringify(selectedFromStorage?.data, null, 2)
    markSelectedElement(selectedFromStorage?.data?.id, selectedFromStorage?.data?.type)
  }
  if (event.key === 'selectedPage') {
    selectedPage = getStorage('selectedPage')
    const selectedPageTextarea = document.getElementById('selectedPage')
    selectedPageTextarea.value = JSON.stringify(selectedPage, null, 2)

    renderAll(selectedPage?.content ?? [])
  }
  if (event.key === 'darkMode') {
    darkMode = getStorage('darkMode') ? true : false

    const darkModeTextarea = document.getElementById('darkMode')
    darkModeTextarea.value = JSON.stringify(darkMode, null, 2)
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
    const selectedElement = selectedPage.content.find((element) => element.id === id && element.type === type)
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
