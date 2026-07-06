export interface ElementDefinition {
  type: string
  name: string
  icon: string
}

export const elementsList: ElementDefinition[] = [
  { type: 'text', name: 'Text', icon: 'text_fields' },
  { type: 'link', name: 'Link', icon: 'link' },
]
