import type { ProjectType } from '../../types/types.ts'

export function getEmptyProjectStructure(id: number | string) {
  return {
    id: String(id),
    title: 'New Project',
    description: 'This is the test project',
    pages: [
      {
        id: '1783189202408',
        title: 'Start page',
        content: [],
        parentId: null,
        type: 'page',
        order: 1,
      },
    ],
    url: '',
    content: [],
    colors: {
      bg_1: { c: '#f8fafc', key: 'bg_1', name: 'Background primary' },
      text_1: { c: '#0f172a', key: 'text_1', name: 'Text primary' },
      bg_2: { c: '#f1f5f9', key: 'bg_2', name: 'Background secondary' },
      text_2: { c: '#475569', key: 'text_2', name: 'Text secondary' },
      bg_3: { c: '#6366f1', key: 'bg_3', name: 'Background tertiary' },
      text_3: { c: '#ffffff', key: 'text_3', name: 'Text tertiary' },
      bg_4: { c: '#e0e7ff', key: 'bg_4', name: 'Background quaternary' },
      text_4: { c: '#3730a3', key: 'text_4', name: 'Text quaternary' },
      bg_5: { c: '#fef3c7', key: 'bg_5', name: 'Background quinary' },
      text_5: { c: '#92400e', key: 'text_5', name: 'Text quinary' },
      bg_1_dark: { c: '#0f172a', key: 'bg_1_dark', name: 'Background primary dark' },
      text_1_dark: { c: '#f8fafc', key: 'text_1_dark', name: 'Text primary dark' },
      bg_2_dark: { c: '#1e293b', key: 'bg_2_dark', name: 'Background secondary dark' },
      text_2_dark: { c: '#94a3b8', key: 'text_2_dark', name: 'Text secondary dark' },
      bg_3_dark: { c: '#4f46e5', key: 'bg_3_dark', name: 'Background tertiary dark' },
      text_3_dark: { c: '#ffffff', key: 'text_3_dark', name: 'Text tertiary dark' },
      bg_4_dark: { c: '#1e1b4b', key: 'bg_4_dark', name: 'Background quaternary dark' },
      text_4_dark: { c: '#a5b4fc', key: 'text_4_dark', name: 'Text quaternary dark' },
      bg_5_dark: { c: '#292524', key: 'bg_5_dark', name: 'Background quinary dark' },
      text_5_dark: { c: '#fcd34d', key: 'text_5_dark', name: 'Text quinary dark' },
    },
    users: {},
  }
}

export async function getProjectById(id: number | string) {
  // TODO: get real project from database
  return await getEmptyProjectStructure(id)
}

export function getProjectFromLocalStorage() {
  const project = localStorage.getItem('currentProject')
  if (project) {
    return JSON.parse(project).data as ProjectType
  }
  return null
}
