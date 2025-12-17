export function newBlockElement(name: string, additionalProps = {}) {
  if (name === 'blockText') {
    return { ...blockText, ...additionalProps }
  }

  return { type: name, ...additionalProps }
}

export const blockText = {
  type: 'block-text',
  content: 'New Block',
  settings: {
    type: 'Paragraph',
  },
  options: {
    elementTypes: ['Paragraph', 'Heading 1', 'Heading 2', 'Heading 3'],
  },
  parent: null,
}
