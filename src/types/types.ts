export interface PageType { 
  id: string;
  parent: string | null;
  title: string;
  type: string;
  order: number;
}

export interface ProjectType {
  id: string;
  title: string;
  pages: {
    [key: string | number]: PageType;
  }
}