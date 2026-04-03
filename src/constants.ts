export const spacingOptions = [
  { value: '', label: 'none' },
  { value: 'pt-4', label: 'Small' },
  { value: 'pt-8', label: 'Medium' },
  { value: 'pt-16', label: 'Large' },
  { value: 'pt-32', label: 'Extra Large' },
]

export const spacingBottomOptions = spacingOptions.map((option) => ({ value: option.value.replace('pt-', 'pb-'), label: option.label }))

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

export const buttonPaddingOptions = [
  { value: 'py-[5px] px-3', label: 'Default (5px / 12px)' },
  { value: 'py-1 px-2', label: 'Small (4px / 8px)' },
  { value: 'py-2 px-4', label: 'Medium (8px / 16px)' },
  { value: 'py-3 px-6', label: 'Large (12px / 24px)' },
  { value: 'py-4 px-8', label: 'Extra Large (16px / 32px)' },
]

export const buttonBorderRadiusOptions = [
  { value: '', label: 'None' },
  { value: 'rounded-sm', label: 'Small' },
  { value: 'rounded', label: 'Medium' },
  { value: 'rounded-lg', label: 'Large' },
  { value: 'rounded-full', label: 'Full (pill)' },
]

export const colorOptions = [
  { value: '', label: 'None' },
  { value: 'bg_1', label: 'Primary Background' },
  { value: 'bg_2', label: 'Secondary Background' },
  { value: 'bg_3', label: 'Accent Background' },
  { value: 'bg_4', label: 'Tertiary Background' },
  { value: 'bg_5', label: 'Quaternary Background' },
]

export const textColorOptions = [
  { value: '', label: 'None' },
  { value: 'text_1', label: 'Primary Text' },
  { value: 'text_2', label: 'Secondary Text' },
  { value: 'text_3', label: 'Accent Text' },
  { value: 'text_4', label: 'Tertiary Text' },
  { value: 'text_5', label: 'Quaternary Text' },
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

export const blockButton = {
  type: 'block-button',
  content: 'Click me',
  settings: {
    href: '',
    target: '_self',
    padding: 'py-[5px] px-3',
    borderRadius: '',
  },
  styles: {
    spacingTop: '',
    spacingBottom: '',
    blockWidth: '',
    inlineSpacing: 'px-4',
    textAlign: '',
  },
  colors: {
    textColorKey: 'text_1',
    backgroundColorKey: 'bg_1',
  },
  parent: null,
}

export const blockLink = {
  type: 'block-link',
  content: 'Link text',
  settings: {
    href: '',
    target: '_self',
  },
  styles: {
    spacingTop: '',
    spacingBottom: '',
    blockWidth: '',
    inlineSpacing: 'px-4',
    textAlign: '',
  },
  colors: {
    textColorKey: 'text_1',
    backgroundColorKey: '',
  },
  parent: null,
}
