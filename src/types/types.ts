export interface PageType {
  id: string
  parent: string | null
  title: string
  type: string
  order: number
}

export interface ProjectType {
  id: string
  title: string
  pages: {
    [key: string | number]: PageType
  }
  content: ContentListType
  colors: {
    [key: string]: { c: string; key: string }
  }
  users: {
    [key: string]: 'owner' | 'editor' | 'viewer'
  }
}

export interface ContentListType {
  [key: string | number]: ContentType
}

export interface ContentType {
  id: string | number
  order: number
  parent: string | null
  pageId: string
  type: string
  [key: string | number]: unknown
}
