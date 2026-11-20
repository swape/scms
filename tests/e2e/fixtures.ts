import { test as base, expect, type Page } from '@playwright/test'
import type { ContentType, ProjectType } from '../../src/types/types'
import { getEmptyProjectStructure } from '../../src/utils/projects'

export { expect } from '@playwright/test'

export function createProject(): ProjectType {
  const project = getEmptyProjectStructure('1')
  const pageId = 'home'
  const link = { text: 'Read more', mode: 'url', url: 'https://example.com/read', pageId, target: '_self', asButton: false } as const
  const content: ContentType[] = [
    { id: 'text', type: 'text', title: 'Welcome', content: 'First line\nSecond line', order: 1, parent: null, pageId },
    { id: 'header', type: 'header', title: 'Header', content: 'A heading', headerLevel: 'h2', order: 2, parent: null, pageId },
    { id: 'image', type: 'image', title: 'Landscape', src: '/favicon.svg', alt: 'A landscape', caption: 'Original caption', order: 3, parent: null, pageId },
    { id: 'link', type: 'link', title: 'Link', link: { ...link }, order: 4, parent: null, pageId },
    {
      id: 'splitBlock',
      type: 'splitBlock',
      title: 'Split feature',
      content: 'Feature description',
      src: '/favicon.svg',
      alt: 'Feature image',
      link: { ...link, asButton: true },
      order: 5,
      parent: null,
      pageId,
    },
  ]
  project.title = 'Test project'
  project.extra = { head: '', style: '' }
  project.pages = [
    { id: pageId, title: 'Home page', type: 'page', parentId: null, order: 1, content },
    { id: 'child', title: 'Child page', type: 'page', parentId: pageId, order: 1, content: [] },
    { id: 'second-child', title: 'Second child', type: 'page', parentId: pageId, order: 2, content: [] },
    { id: 'about', title: 'About page', type: 'page', parentId: null, order: 2, content: [] },
  ]
  project.menu = {
    type: 'menu1',
    style: { layout: 'horizontal', backgroundColor: 'bg_1', textColor: 'text_1' },
    elements: [
      { id: 'home-link', type: 'link', title: 'Home', link: { ...link, text: 'Home', mode: 'page', pageId } },
      { id: 'dropdown', type: 'dropdown', title: 'Explore', children: [{ id: 'nested-link', type: 'link', title: 'Docs', link: { ...link, text: 'Docs' } }] },
      { id: 'auto', type: 'auto', title: 'Children', autoParentPageId: pageId, autoMaxItems: 0 },
    ],
  }
  project.footer = {
    type: 'footer1',
    elements: [
      { id: 'footer-text', type: 'text', title: 'Copyright', text: 'Test copyright' },
      { id: 'footer-link', type: 'link', title: 'Contact', link: { ...link, text: 'Contact', target: '_blank' } },
      { id: 'footer-social', type: 'social', title: 'github', socialPlatform: 'github', link: { ...link, target: '_blank' } },
      { id: 'footer-html', type: 'html', title: 'Custom HTML', html: '<strong>Footer note</strong>' },
    ],
  }
  return project
}

export async function seedProject(page: Page, project: ProjectType) {
  await page.addInitScript((data) => {
    // Seed once per tab so reloads and sign-out exercise actual persisted state.
    if (sessionStorage.getItem('e2e-seeded')) {
      return
    }
    sessionStorage.setItem('e2e-seeded', 'true')
    localStorage.setItem('scms', JSON.stringify({ uid: 'e2e-user', displayName: 'Test user', email: 'test@example.com' }))
    localStorage.setItem('currentProject', JSON.stringify({ data, storeDate: Date.now() }))
  }, project)
}

export async function storedProject(page: Page): Promise<ProjectType> {
  return page.evaluate(() => JSON.parse(localStorage.getItem('currentProject') ?? 'null').data)
}

export function preview(page: Page) {
  return page.frameLocator('iframe[title="Preview"]')
}

export async function selectBlock(page: Page, id: string) {
  await preview(page).locator(`section[data-id="${id}"]`).click()
  await expect(page.locator('.settings')).toContainText(`ID: ${id}`)
  await expect(page.getByRole('status')).toHaveCount(0)
  await expect(page.getByRole('alert')).toHaveCount(0)
}

export async function openPreview(page: Page, project: ProjectType) {
  const query = new URLSearchParams({
    page: project.pages[0].id,
    project: String(project.id),
    data: JSON.stringify(project.pages[0]),
    settings: JSON.stringify(project),
  })
  await page.goto(`/preview/?${query}`)
}

export const test = base.extend<{ project: ProjectType; authenticatedPage: Page; editorPage: Page }>({
  project: async ({}, use) => {
    await use(createProject())
  },
  page: async ({ page }, use) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) => route.fulfill({ contentType: 'text/css', body: '' }))
    await page.route('https://placehold.co/**', (route) =>
      route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="orange"/></svg>' })
    )
    await use(page)
    expect(errors, 'Uncaught browser errors').toEqual([])
  },
  authenticatedPage: async ({ page, project }, use) => {
    await seedProject(page, project)
    await use(page)
  },
  editorPage: async ({ authenticatedPage: page }, use) => {
    await page.goto('/editor?p=1&local=true')
    await expect(preview(page).getByRole('heading', { name: 'Welcome', exact: true })).toBeVisible()
    await use(page)
  },
})
