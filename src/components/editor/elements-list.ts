import { getCss as headerCss } from '../../blocks/Header/css.ts'
import { getCss as imageCss } from '../../blocks/Image/css.ts'
import { getCss as linkCss } from '../../blocks/Link/css.ts'
import { getDefaultLinkSettings } from '../../blocks/shared/defaults.ts'
import { getCss as splitBlockCss } from '../../blocks/SplitBlock/css.ts'
import { getCss as textCss } from '../../blocks/Text/css.ts'
import type { EditorDefinition, ElementDefinition, PageDefinition } from '../../types/types.ts'

export type { ElementDefinition } from '../../types/types.ts'

export const elementsList: ElementDefinition[] = [
  {
    type: 'text',
    name: 'Text',
    icon: 'text_fields',
    editor: () => import('../../blocks/Text/index.svelte'),
    preview: '/src/blocks/Text/Preview.astro',
    defaults: () => ({ content: 'New text content' }),
    css: textCss,
  },
  {
    type: 'link',
    name: 'Link',
    icon: 'link',
    editor: () => import('../../blocks/Link/index.svelte'),
    preview: '/src/blocks/Link/Preview.astro',
    defaults: (firstPageId) => ({ link: getDefaultLinkSettings(firstPageId) }),
    css: linkCss,
  },
  {
    type: 'header',
    name: 'Header',
    icon: 'title',
    editor: () => import('../../blocks/Header/index.svelte'),
    preview: '/src/blocks/Header/Preview.astro',
    defaults: () => ({ content: 'New text content' }),
    css: headerCss,
  },
  {
    type: 'image',
    name: 'Image',
    icon: 'image',
    editor: () => import('../../blocks/Image/index.svelte'),
    preview: '/src/blocks/Image/Preview.astro',
    css: imageCss,
  },
  {
    type: 'splitBlock',
    name: 'Split Block',
    icon: 'view_column',
    editor: () => import('../../blocks/SplitBlock/index.svelte'),
    preview: '/src/blocks/SplitBlock/Preview.astro',
    defaults: (firstPageId) => ({
      content: 'Add a short description for this split block.',
      link: { ...getDefaultLinkSettings(firstPageId), asButton: true },
      flipped: false,
    }),
    css: splitBlockCss,
  },
]

export const pageDefinition: PageDefinition = { type: 'page', name: 'Page', icon: 'draft', editor: () => import('../../blocks/Page/index.svelte') }

export const globalSettingsDefinitions: EditorDefinition[] = [
  { type: 'footer', name: 'Footer', icon: 'view_agenda', editor: () => import('../../blocks/Footer/index.svelte') },
  { type: 'menu', name: 'Menu', icon: 'menu', editor: () => import('../../blocks/Menu/index.svelte') },
]

export function getElementDefinition(type: string): ElementDefinition | undefined {
  return elementsList.find((element) => element.type === type)
}

export function getEditorDefinition(type: string): EditorDefinition | undefined {
  return type === pageDefinition.type ? pageDefinition : (getElementDefinition(type) ?? globalSettingsDefinitions.find((definition) => definition.type === type))
}
