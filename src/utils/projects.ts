import type { ProjectType } from '../types/types.ts'

// TODO: add example menu structure for new projects
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
    "menu": {
    "type": "menu1",
    "elements": [
      {
        "id": "1791044792069-igg7qsna2r",
        "type": "link",
        "title": "New link",
        "link": {
          "text": "New link",
          "mode": "page",
          "url": "",
          "pageId": "1783189202408",
          "target": "_self",
          "asButton": false
        }
      },
      {
        "id": "1791044813156-45fd2hlk33x",
        "type": "dropdown",
        "title": "hello",
        "children": [
          {
            "id": "1791044829477-49bhpzn706q",
            "type": "auto",
            "title": "Pages",
            "autoParentPageId": "1783189202408",
            "autoMaxItems": 0
          }
        ]
      },
      {
        "id": "1791044848918-ruoybwgrnok",
        "type": "link",
        "title": "New link",
        "link": {
          "text": "New link",
          "mode": "url",
          "url": "https://swape.net",
          "pageId": "",
          "target": "_self",
          "asButton": false
        }
      }
    ],
    "style": {
      "layout": "horizontal",
      "backgroundColor": "#932f2f",
      "textColor": "#7088bd"
    }
  },
    footer: {
      type: 'footer1',
      elements: [
        {
          id: String(Date.now()),
          type: 'text',
          title: 'Text block',
          text: 'This is a sample footer text. You can edit it in the project settings.',
        },
        {
          id: String(Date.now() + 1),
          type: 'link',
          title: 'Sample link',
          link: {
            text: 'Sample link',
            mode: 'url',
            url: '',
            pageId: '',
            target: '_self',
            asButton: false,
          },
        },
      ],
    },
    extra: {
      head: `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">`,
      style: `
.roboto,body {
  font-family: "Roboto", sans-serif;
  font-optical-sizing: auto;
  font-weight: 300;
  font-style: normal;
}`,
    },
  }
}

export function getProjectById(id: number | string) {
  // TODO: get real project from database
  return getEmptyProjectStructure(id)
}

export function getProjectFromLocalStorage() {
  const project = localStorage.getItem('currentProject')
  if (project) {
    return JSON.parse(project).data as ProjectType
  }
  return null
}
