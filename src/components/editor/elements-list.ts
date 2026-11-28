import { getCss as callToActionCss } from '../../blocks/CallToAction/css.ts'
import { getCss as cardGridCss } from '../../blocks/CardGrid/css.ts'
import { getCss as faqCss } from '../../blocks/FAQ/css.ts'
import { getCss as headerCss } from '../../blocks/Header/css.ts'
import { getCss as heroCss } from '../../blocks/Hero/css.ts'
import { getCss as imageCss } from '../../blocks/Image/css.ts'
import { getCss as linkCss } from '../../blocks/Link/css.ts'
import { getDefaultLinkSettings } from '../../blocks/shared/helpers.ts'
import { getCss as splitBlockCss } from '../../blocks/SplitBlock/css.ts'
import { getCss as textCss } from '../../blocks/Text/css.ts'
import { getCss as videoCss } from '../../blocks/Video/css.ts'
import type { EditorDefinition, ElementDefinition, PageDefinition } from '../../types/types.ts'

export type { ElementDefinition } from '../../types/types.ts'

export const elementsList: ElementDefinition[] = [
  {
    type: 'hero',
    name: 'Hero',
    icon: 'web_asset',
    editor: () => import('../../blocks/Hero/index.svelte'),
    preview: '/src/blocks/Hero/Preview.astro',
    defaults: (firstPageId) => ({
      content: 'Introduce your business and invite visitors to take the next step.',
      headerLevel: 'h1',
      link: { ...getDefaultLinkSettings(firstPageId), asButton: true },
    }),
    css: heroCss,
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
    type: 'text',
    name: 'Text',
    icon: 'text_fields',
    editor: () => import('../../blocks/Text/index.svelte'),
    preview: '/src/blocks/Text/Preview.astro',
    defaults: () => ({ content: 'New text content' }),
    css: textCss,
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
  {
    type: 'cardGrid',
    name: 'Card Grid',
    icon: 'grid_view',
    editor: () => import('../../blocks/CardGrid/index.svelte'),
    preview: '/src/blocks/CardGrid/Preview.astro',
    defaults: (firstPageId) => ({
      style: { cardBackgroundColor: 'bg_2', cardTextColor: 'text_1' },
      cardItems: Array.from({ length: 3 }, (_, index) => ({
        id: `card-${index + 1}`,
        title: `Card ${index + 1}`,
        content: 'Describe your service or feature.',
        link: getDefaultLinkSettings(firstPageId),
      })),
    }),
    css: cardGridCss,
  },
  {
    type: 'video',
    name: 'Video',
    icon: 'smart_display',
    editor: () => import('../../blocks/Video/index.svelte'),
    preview: '/src/blocks/Video/Preview.astro',
    defaults: () => ({ videoControls: true, videoAutoplay: false, videoLoop: false, videoMuted: false }),
    css: videoCss,
  },
  {
    type: 'faq',
    name: 'FAQ',
    icon: 'quiz',
    editor: () => import('../../blocks/FAQ/index.svelte'),
    preview: '/src/blocks/FAQ/Preview.astro',
    defaults: () => ({ faqItems: [{ id: 'question-1', question: 'What would you like to know?', answer: 'Add your answer here.' }] }),
    css: faqCss,
  },
  {
    type: 'callToAction',
    name: 'Call to Action',
    icon: 'ads_click',
    editor: () => import('../../blocks/CallToAction/index.svelte'),
    preview: '/src/blocks/CallToAction/Preview.astro',
    defaults: (firstPageId) => ({ content: 'Ready to take the next step?', link: { ...getDefaultLinkSettings(firstPageId), asButton: true } }),
    css: callToActionCss,
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
