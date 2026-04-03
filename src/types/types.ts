export interface PageType {
  id: string
  parent: string | null
  title: string
  type: string
  order: number
  colors: {
    textColorKey: string
    backgroundColorKey: string
  }
}

export interface ProjectType {
  id: string | number
  title: string
  description: string
  url: string
  pages?: {
    [key: string | number]: PageType
  }
  content?: ContentListType
  colors?: {
    [key: string]: { c: string; key: string }
  }
  users?: {
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
  styles?: {
    spacingTop?: string
    spacingBottom?: string
    blockWidth?: string
    inlineSpacing?: string
    textAlign?: string
  }
  colors?: {
    backgroundColorKey?: string
    textColorKey?: string
  }
  [key: string | number]: unknown
}
export interface UserType {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  token: string
}
