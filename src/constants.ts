
export const spacingOptions = [
  { value: '', label: 'none' },
  { value: 'pt-4', label: 'Small' },
  { value: 'pt-8', label: 'Medium' },
  { value: 'pt-16', label: 'Large' },
  { value: 'pt-32', label: 'Extra Large' },
]

export const widthOptions = [
  { value: '', label: 'Auto Width' },
  { value: 'max-w-md', label: 'Small Width' },
  { value: 'max-w-3xl', label: 'Medium Width' },
  { value: 'max-w-xl', label: 'Narrow Width' },
  { value: 'max-w-full', label: 'Full Width' },
]

export const textAlignOptions = [
  { value: '', label: 'Left' },
  { value: 'text-center', label: 'Center' },
  { value: 'text-right', label: 'Right' },
  { value: 'text-justify', label: 'Justify' },
]

export const inlineSpacingOptions = [
  { value: '', label: 'none' },
  { value: 'px-2', label: 'Small' },
  { value: 'px-4', label: 'Medium' },
  { value: 'px-6', label: 'Large' },
  { value: 'px-8', label: 'Extra Large' },
]

export const colorOptions = [
  { value: '', label: 'None' },
  { value: 'bg_1', label: 'Primary Background' },
  { value: 'bg_2', label: 'Secondary Background' },
  { value: 'bg_3', label: 'Accent Background' },
]

export const textColorOptions = [
  { value: '', label: 'None' },
  { value: 'text_1', label: 'Primary Text' },
  { value: 'text_2', label: 'Secondary Text' },
  { value: 'text_3', label: 'Accent Text' },
]


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