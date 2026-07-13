import type { ProjectType } from '../../types/types.ts'

export function getEmptyProjectStructure(id: number | string): ProjectType {
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
    colors: [
      { c: '#f8fafc', key: 'bg_1', name: 'Background primary' },
      { c: '#0f172a', key: 'text_1', name: 'Text primary' },
      { c: '#f1f5f9', key: 'bg_2', name: 'Background secondary' },
      { c: '#475569', key: 'text_2', name: 'Text secondary' },
      { c: '#6366f1', key: 'bg_3', name: 'Background tertiary' },
      { c: '#ffffff', key: 'text_3', name: 'Text tertiary' },
      { c: '#e0e7ff', key: 'bg_4', name: 'Background quaternary' },
      { c: '#3730a3', key: 'text_4', name: 'Text quaternary' },
      { c: '#fef3c7', key: 'bg_5', name: 'Background quinary' },
      { c: '#92400e', key: 'text_5', name: 'Text quinary' },
      { c: '#0f172a', key: 'bg_1_dark', name: 'Background primary dark' },
      { c: '#f8fafc', key: 'text_1_dark', name: 'Text primary dark' },
      { c: '#1e293b', key: 'bg_2_dark', name: 'Background secondary dark' },
      { c: '#94a3b8', key: 'text_2_dark', name: 'Text secondary dark' },
      { c: '#4f46e5', key: 'bg_3_dark', name: 'Background tertiary dark' },
      { c: '#ffffff', key: 'text_3_dark', name: 'Text tertiary dark' },
      { c: '#1e1b4b', key: 'bg_4_dark', name: 'Background quaternary dark' },
      { c: '#a5b4fc', key: 'text_4_dark', name: 'Text quaternary dark' },
      { c: '#292524', key: 'bg_5_dark', name: 'Background quinary dark' },
      { c: '#fcd34d', key: 'text_5_dark', name: 'Text quinary dark' },
    ],
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
