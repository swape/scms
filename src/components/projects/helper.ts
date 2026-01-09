export function getEmptyProjectStructure(id: number | string) {
  return {
    id: String(id),
    title: 'New Project',
    description: 'Brand new project',
    pages: {},
    url: '',
    content: {},
    colors: {
      bg_1: { c: '#ffffff', key: 'bg_1' },
      text_1: { c: '#000000', key: 'text_1' },
      bg_2: { c: '#f0f0f0', key: 'bg_2' },
      text_2: { c: '#333333', key: 'text_2' },
      bg_3: { c: '#ff0000', key: 'bg_3' },
      text_3: { c: '#ffffff', key: 'text_3' },
      bg_1_dark: { c: '#000000', key: 'bg_1_dark' },
      text_1_dark: { c: '#ffffff', key: 'text_1_dark' },
      bg_2_dark: { c: '#333333', key: 'bg_2_dark' },
      text_2_dark: { c: '#f0f0f0', key: 'text_2_dark' },
      bg_3_dark: { c: '#cc0000', key: 'bg_3_dark' },
      text_3_dark: { c: '#000000', key: 'text_3_dark' },
    },
    users: {},
  }
}
