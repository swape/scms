import { selectedElement } from '../../store.ts'
import type { BlockEditorProps, ContentType, LinkSettings } from '../../types/types.ts'

export function updateBlockField(key: string, value: unknown, update: BlockEditorProps['update'], debounce: BlockEditorProps['updatePageContentWithDebounce']) {
  update(key, value)
  debounce()
}

export function updateStyleNumber(
  key: string,
  event: Event,
  style: ContentType['style'] | undefined,
  update: BlockEditorProps['update'],
  debounce: BlockEditorProps['updatePageContentWithDebounce']
) {
  const input = event.target as HTMLInputElement
  const nextStyle = { ...style }
  if (!input.value.trim()) {
    delete nextStyle[key]
  } else {
    nextStyle[key] = Number(input.value)
  }

  updateBlockField('style', nextStyle, update, debounce)
}

export function updateStyleColor(
  key: string,
  event: Event,
  style: ContentType['style'] | undefined,
  update: BlockEditorProps['update'],
  debounce: BlockEditorProps['updatePageContentWithDebounce']
) {
  const input = event.target as HTMLInputElement
  updateBlockField('style', { ...style, [key]: input.value }, update, debounce)
}

export function updateSelectedLink(
  elementType: string,
  getDefaultLinkSettings: () => LinkSettings,
  updateFn: (element: ContentType, link: LinkSettings) => void,
  debounce: BlockEditorProps['updatePageContentWithDebounce']
) {
  selectedElement.update((element) => {
    if (!element || element.type !== elementType) {
      return element
    }

    const block = element as ContentType
    const link = { ...(block.link || getDefaultLinkSettings()) }
    if (link.style) {
      link.style = { ...link.style }
    }

    updateFn(block, link)
    debounce()
    return { ...block, link }
  })
}
