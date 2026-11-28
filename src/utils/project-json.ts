import { elementsList } from '../components/editor/elements-list.ts'
import type { ProjectType } from '../types/types.ts'
import { normalizeProjectLengths } from './projects.ts'

const blockTypes = new Set(elementsList.map((element) => element.type))
const linkModes = ['url', 'page']
const linkTargets = ['_self', '_blank']
const headerLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
const menuTypes = ['link', 'dropdown', 'auto']
const menuLayouts = ['horizontal', 'vertical']
const footerTypes = ['link', 'social', 'html', 'text']
const socialPlatforms = ['facebook', 'twitter', 'instagram', 'linkedin', 'github', 'youtube']
const userRoles = ['owner', 'editor', 'viewer']
const contentStringFields = ['content', 'alt', 'src', 'imageType', 'caption', 'imageId']

function invalid(path: string, message: string): never {
  throw new Error(`${path}: ${message}.`)
}

function object(value: unknown, path: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    invalid(path, 'must be an object')
  }
  return value as Record<string, unknown>
}

function array(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) {
    invalid(path, 'must be an array')
  }
  return value
}

function string(value: unknown, path: string): string {
  if (typeof value !== 'string') {
    invalid(path, 'must be a string')
  }
  return value
}

function number(value: unknown, path: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    invalid(path, 'must be a finite number')
  }
  return value
}

function boolean(value: unknown, path: string): void {
  if (typeof value !== 'boolean') {
    invalid(path, 'must be a boolean')
  }
}

function identifier(value: unknown, path: string): string | number {
  if (typeof value !== 'string' && (typeof value !== 'number' || !Number.isFinite(value))) {
    invalid(path, 'must be a string or a finite number')
  }
  return value
}

function nullableString(value: unknown, path: string): string | null {
  if (value !== null && typeof value !== 'string') {
    invalid(path, 'must be a string or null')
  }
  return value
}

function enumeration(value: unknown, path: string, choices: readonly string[]): void {
  if (typeof value !== 'string' || !choices.includes(value)) {
    invalid(path, `must be one of ${choices.join(', ')}`)
  }
}

function validateStyle(value: unknown, path: string): void {
  const style = object(value, path)
  for (const [key, entry] of Object.entries(style)) {
    if (typeof entry !== 'string') {
      number(entry, `${path}[${JSON.stringify(key)}]`)
    }
  }
}

function validateMobileStyle(value: unknown, path: string): void {
  const style = object(value, path)
  for (const [key, entry] of Object.entries(style)) {
    const field = `${path}[${JSON.stringify(key)}]`
    if (key === 'flipped' || key === 'asButton') {
      boolean(entry, field)
    } else if (key === 'layout') {
      enumeration(entry, field, menuLayouts)
    } else if (key === 'footerType') {
      enumeration(entry, field, ['footer1'])
    } else if (typeof entry !== 'string') {
      number(entry, field)
    }
  }
}

function validateLink(value: unknown, path: string): void {
  const link = object(value, path)
  string(link.text, `${path}.text`)
  enumeration(link.mode, `${path}.mode`, linkModes)
  string(link.url, `${path}.url`)
  string(link.pageId, `${path}.pageId`)
  enumeration(link.target, `${path}.target`, linkTargets)
  boolean(link.asButton, `${path}.asButton`)
  if (link.style !== undefined) {
    validateStyle(link.style, `${path}.style`)
  }
}

function validateFaqItems(value: unknown, path: string): void {
  const ids = new Set<string>()
  array(value, path).forEach((entry, index) => {
    const itemPath = `${path}[${index}]`
    const item = object(entry, itemPath)
    const id = string(item.id, `${itemPath}.id`)
    if (ids.has(id)) {
      invalid(`${itemPath}.id`, 'duplicates another FAQ item ID')
    }
    ids.add(id)
    string(item.question, `${itemPath}.question`)
    string(item.answer, `${itemPath}.answer`)
    if (item.openOnStart !== undefined) {
      boolean(item.openOnStart, `${itemPath}.openOnStart`)
    }
  })
}

function validateCardItems(value: unknown, path: string): void {
  const ids = new Set<string>()
  array(value, path).forEach((entry, index) => {
    const itemPath = `${path}[${index}]`
    const item = object(entry, itemPath)
    const id = string(item.id, `${itemPath}.id`)
    if (ids.has(id)) {
      invalid(`${itemPath}.id`, 'duplicates another card ID')
    }
    ids.add(id)
    string(item.title, `${itemPath}.title`)
    string(item.content, `${itemPath}.content`)
    for (const field of ['src', 'alt']) {
      if (item[field] !== undefined) {
        string(item[field], `${itemPath}.${field}`)
      }
    }
    if (item.link !== undefined) {
      validateLink(item.link, `${itemPath}.link`)
    }
  })
}

function validateContent(value: unknown, path: string): void {
  const ids = new Set<string | number>()
  array(value, path).forEach((entry, index) => {
    const itemPath = `${path}[${index}]`
    const item = object(entry, itemPath)
    const id = identifier(item.id, `${itemPath}.id`)
    if (ids.has(id)) {
      invalid(`${itemPath}.id`, 'duplicates another block ID on this page')
    }
    ids.add(id)
    number(item.order, `${itemPath}.order`)
    nullableString(item.parent, `${itemPath}.parent`)
    string(item.pageId, `${itemPath}.pageId`)
    string(item.title, `${itemPath}.title`)
    const type = string(item.type, `${itemPath}.type`)
    if (!blockTypes.has(type)) {
      invalid(`${itemPath}.type`, `unregistered content block type ${JSON.stringify(type)}`)
    }
    for (const field of contentStringFields) {
      if (item[field] !== undefined) {
        string(item[field], `${itemPath}.${field}`)
      }
    }
    if (item.style !== undefined) {
      validateStyle(item.style, `${itemPath}.style`)
    }
    if (item.mobileStyle !== undefined) {
      validateMobileStyle(item.mobileStyle, `${itemPath}.mobileStyle`)
    }
    if (item.link !== undefined) {
      validateLink(item.link, `${itemPath}.link`)
    }
    if (item.headerLevel !== undefined) {
      enumeration(item.headerLevel, `${itemPath}.headerLevel`, headerLevels)
    }
    if (item.flipped !== undefined) {
      boolean(item.flipped, `${itemPath}.flipped`)
    }
    if (item.faqItems !== undefined) {
      validateFaqItems(item.faqItems, `${itemPath}.faqItems`)
    }
    if (item.faqCloseOthers !== undefined) {
      boolean(item.faqCloseOthers, `${itemPath}.faqCloseOthers`)
    }
    if (item.cardItems !== undefined) {
      validateCardItems(item.cardItems, `${itemPath}.cardItems`)
    }
    if (item.poster !== undefined) {
      string(item.poster, `${itemPath}.poster`)
    }
    for (const field of ['videoControls', 'videoAutoplay', 'videoLoop', 'videoMuted']) {
      if (item[field] !== undefined) {
        boolean(item[field], `${itemPath}.${field}`)
      }
    }
  })
}

function validatePages(value: unknown): void {
  const pages = new Map<string, { parentId: string | null; path: string }>()
  array(value, 'project.pages').forEach((entry, index) => {
    const path = `project.pages[${index}]`
    const page = object(entry, path)
    const id = string(page.id, `${path}.id`)
    if (!id) {
      invalid(`${path}.id`, 'must not be empty')
    }
    if (pages.has(id)) {
      invalid(`${path}.id`, 'duplicates another page ID')
    }
    const parentId = nullableString(page.parentId, `${path}.parentId`)
    pages.set(id, { parentId, path })
    string(page.title, `${path}.title`)
    number(page.order, `${path}.order`)
    if (page.type !== 'page') {
      invalid(`${path}.type`, 'must be page')
    }
    validateContent(page.content, `${path}.content`)
    if (page.style !== undefined) {
      validateStyle(page.style, `${path}.style`)
    }
    if (page.mobileStyle !== undefined) {
      validateMobileStyle(page.mobileStyle, `${path}.mobileStyle`)
    }
    if (page.colors !== undefined) {
      const colors = object(page.colors, `${path}.colors`)
      string(colors.textColorKey, `${path}.colors.textColorKey`)
      string(colors.backgroundColorKey, `${path}.colors.backgroundColorKey`)
    }
  })

  for (const page of pages.values()) {
    if (page.parentId !== null && !pages.has(page.parentId)) {
      invalid(`${page.path}.parentId`, `references missing page ${JSON.stringify(page.parentId)}`)
    }
  }

  // Each parent chain is visited once, without recursion or a depth limit.
  const complete = new Set<string>()
  const chain = new Set<string>()
  for (const id of pages.keys()) {
    let current: string | null = id
    while (current !== null && !complete.has(current)) {
      if (chain.has(current)) {
        invalid(`${pages.get(current)!.path}.parentId`, 'forms a cycle in the page hierarchy')
      }
      chain.add(current)
      current = pages.get(current)!.parentId
    }
    for (const visited of chain) {
      complete.add(visited)
    }
    chain.clear()
  }
}

function validateMenu(value: unknown): void {
  const menu = object(value, 'project.menu')
  if (menu.type !== 'menu1') {
    invalid('project.menu.type', 'must be menu1')
  }
  if (menu.mobileStyle !== undefined) {
    validateMobileStyle(menu.mobileStyle, 'project.menu.mobileStyle')
  }
  if (menu.style !== undefined) {
    const style = object(menu.style, 'project.menu.style')
    if (style.layout !== undefined) {
      enumeration(style.layout, 'project.menu.style.layout', menuLayouts)
    }
    if (style.backgroundColor !== undefined) {
      string(style.backgroundColor, 'project.menu.style.backgroundColor')
    }
    if (style.textColor !== undefined) {
      string(style.textColor, 'project.menu.style.textColor')
    }
    if (style.sticky !== undefined) {
      boolean(style.sticky, 'project.menu.style.sticky')
    }
  }

  const keys = new Set<string>()
  const pending = [{ items: array(menu.elements, 'project.menu.elements'), path: 'project.menu.elements', keyPrefix: '', rendered: true }]
  while (pending.length > 0) {
    const group = pending.pop()!
    group.items.forEach((entry, index) => {
      const path = `${group.path}[${index}]`
      const item = object(entry, path)
      const fallbackKey = `${group.keyPrefix}${index}`
      if (item.id !== undefined) {
        string(item.id, `${path}.id`)
      }
      if (group.rendered) {
        // The menu editor flattens dropdown descendants into one keyed list.
        const key = item.id === undefined ? fallbackKey : string(item.id, `${path}.id`)
        if (keys.has(key)) {
          invalid(`${path}.id`, `duplicates menu render key ${JSON.stringify(key)} (including IDs derived from an item's position)`)
        }
        keys.add(key)
      }
      enumeration(item.type, `${path}.type`, menuTypes)
      string(item.title, `${path}.title`)
      if (item.link !== undefined) {
        validateLink(item.link, `${path}.link`)
      }
      if (item.autoParentPageId !== undefined) {
        string(item.autoParentPageId, `${path}.autoParentPageId`)
      }
      if (item.autoMaxItems !== undefined) {
        number(item.autoMaxItems, `${path}.autoMaxItems`)
      }
      if (item.children !== undefined) {
        pending.push({
          items: array(item.children, `${path}.children`),
          path: `${path}.children`,
          keyPrefix: `${fallbackKey}-`,
          rendered: group.rendered && item.type === 'dropdown',
        })
      }
    })
  }
}

function validateFooter(value: unknown): void {
  const footer = object(value, 'project.footer')
  if (footer.type !== 'footer1') {
    invalid('project.footer.type', 'must be footer1')
  }
  if (footer.mobileStyle !== undefined) {
    validateMobileStyle(footer.mobileStyle, 'project.footer.mobileStyle')
  }
  if (footer.style !== undefined) {
    validateStyle(footer.style, 'project.footer.style')
  }
  const ids = new Set<string>()
  array(footer.elements, 'project.footer.elements').forEach((entry, index) => {
    const path = `project.footer.elements[${index}]`
    const item = object(entry, path)
    const id = string(item.id, `${path}.id`)
    if (ids.has(id)) {
      invalid(`${path}.id`, 'duplicates another footer element ID')
    }
    ids.add(id)
    enumeration(item.type, `${path}.type`, footerTypes)
    string(item.title, `${path}.title`)
    if (item.link !== undefined) {
      validateLink(item.link, `${path}.link`)
    }
    if (item.socialPlatform !== undefined) {
      enumeration(item.socialPlatform, `${path}.socialPlatform`, socialPlatforms)
    }
    if (item.html !== undefined) {
      string(item.html, `${path}.html`)
    }
    if (item.text !== undefined) {
      string(item.text, `${path}.text`)
    }
  })
}

export function parseProjectJson(text: string): ProjectType {
  let parsed: unknown
  try {
    parsed = JSON.parse(text.charCodeAt(0) === 0xfeff ? text.slice(1) : text)
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'could not parse the file'}`)
  }

  const project = object(parsed, 'project')
  if (identifier(project.id, 'project.id') === '') {
    invalid('project.id', 'must not be empty')
  }
  string(project.title, 'project.title')
  string(project.description, 'project.description')
  string(project.url, 'project.url')
  validatePages(project.pages)
  if (project.colors !== undefined) {
    array(project.colors, 'project.colors').forEach((entry, index) => {
      const path = `project.colors[${index}]`
      const color = object(entry, path)
      string(color.c, `${path}.c`)
      string(color.cDark, `${path}.cDark`)
      string(color.key, `${path}.key`)
      string(color.name, `${path}.name`)
    })
  }
  if (project.users !== undefined) {
    const users = object(project.users, 'project.users')
    for (const [key, role] of Object.entries(users)) {
      enumeration(role, `project.users[${JSON.stringify(key)}]`, userRoles)
    }
  }
  const extra = object(project.extra, 'project.extra')
  string(extra.head, 'project.extra.head')
  string(extra.style, 'project.extra.style')
  validateMenu(project.menu)
  validateFooter(project.footer)

  // Keep additional fields and explicit units intact; bare legacy lengths default to px.
  return normalizeProjectLengths(parsed as ProjectType)
}
