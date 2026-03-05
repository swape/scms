export function newBlockElement(name: string, additionalProps = {}) {
  if (name === 'blockText') {
    return { ...blockText, ...additionalProps }
  } else if(name === 'blockDivider') {
    return { ...blockDivider, ...additionalProps }
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
  styles: {
    spacingTop: '',
    spacingBottom: '',
    blockWidth: '',
    inlineSpacing: 'px-4',
    textAlign: '',
  },
  colors: {
    textColorKey: '',
    backgroundColorKey: '',
  },
  parent: null,
}

export const blockDivider = {
  type: 'block-divider',
  styles: {
    spacingTop: 'pt-8',
    spacingBottom: 'pb-8',
    blockWidth: 'max-w-3xl',
  },
  colors: {
    backgroundColorKey: 'bg_3',
  },
  parent: null,
}