import { currentProject, projects } from '../store.ts'
import type { MenuElement, ProjectType } from '../types/types.ts'

export function createMenuElement(type: MenuElement['type']): MenuElement {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`

  if (type === 'link') {
    return {
      id,
      type,
      title: 'New link',
      link: {
        text: 'New link',
        mode: 'page',
        url: '',
        pageId: '',
        target: '_self',
        asButton: false,
      },
    }
  }

  if (type === 'dropdown') {
    return { id, type, title: 'New dropdown', children: [] }
  }

  return { id, type, title: 'Pages', autoParentPageId: '', autoMaxItems: 0 }
}

export function saveMenuToProject(projectId: string | number, menu: ProjectType['menu']): void {
  projects.update((items) => items?.map((project) => (project.id === projectId ? { ...project, menu } : project)) ?? items)
  currentProject.update((project) => (project?.id === projectId ? { ...project, menu } : project))
}
