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
      { c: '#f8fafc', key: 'bg_1', name: 'Background primary', cDark: '#0f172a' },
      { c: '#0f172a', key: 'text_1', name: 'Text primary', cDark: '#f8fafc' },
      { c: '#f1f5f9', key: 'bg_2', name: 'Background secondary', cDark: '#1e293b' },
      { c: '#475569', key: 'text_2', name: 'Text secondary', cDark: '#94a3b8' },
      { c: '#6366f1', key: 'bg_3', name: 'Background tertiary', cDark: '#4f46e5' },
      { c: '#ffffff', key: 'text_3', name: 'Text tertiary', cDark: '#000000' },
      { c: '#e0e7ff', key: 'bg_4', name: 'Background quaternary', cDark: '#1e1b4b' },
      { c: '#3730a3', key: 'text_4', name: 'Text quaternary', cDark: '#a5b4fc' },
      { c: '#fef3c7', key: 'bg_5', name: 'Background quinary', cDark: '#292524' },
      { c: '#92400e', key: 'text_5', name: 'Text quinary', cDark: '#fcd34d' },
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
