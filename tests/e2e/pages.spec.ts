import { expect, openPreview, preview, seedProject, storedProject, test } from './fixtures'

test('home page supports demo sign-in, reload, and sign-out', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('SCMS')
  await expect(page.getByRole('heading', { name: 'SCMS' })).toBeVisible()
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible()
  await page.getByRole('button', { name: 'Sign out' }).click()
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible()
  await expect.poll(() => page.evaluate(() => localStorage.getItem('scms'))).toBeNull()
})

for (const route of ['/dashboard', '/project?p=1', '/editor?p=1']) {
  test(`${route} hides protected content until sign-in`, async ({ page }) => {
    await page.goto(route)
    await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible()
    await expect(page.locator('article')).toBeEmpty()
    await page.getByRole('button', { name: 'Sign in', exact: true }).click()
    await expect(page.locator('article')).not.toBeEmpty()
    await page.getByRole('button', { name: 'Sign out' }).click()
    await expect(page.locator('article')).toBeEmpty()
  })
}

test('dashboard adds projects and opens project details', async ({ authenticatedPage: page }) => {
  await page.goto('/dashboard')
  await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: /New Project/ })).toHaveCount(1)
  await page.getByRole('button', { name: '+', exact: true }).click()
  await expect(page.getByRole('button', { name: /New Project/ })).toHaveCount(2)
  await page.getByRole('button', { name: /1 New Project/ }).click()
  await expect(page).toHaveURL(/\/project\?p=1$/)
  await expect(page.getByRole('link', { name: 'Editor', exact: true })).toHaveAttribute('href', '/editor?p=1')
  await expect(page.getByRole('link', { name: 'Editor (continue last unsaved)', exact: true })).toHaveAttribute('href', '/editor?p=1&local=true')
})

test('project settings, colors, users, and summary tabs work', async ({ authenticatedPage: page }) => {
  await page.goto('/project?p=1')
  await expect(page.getByRole('heading', { name: 'Project', exact: true })).toBeVisible()
  await page.locator('article').getByRole('button', { name: 'Settings', exact: true }).click()
  await page.getByLabel('Project title:').fill('Updated project')
  await page.getByLabel('Project title:').press('End')
  await page.getByLabel('Url:', { exact: true }).fill('https://example.com')
  await page.getByLabel('Url:', { exact: true }).press('End')
  await page.getByLabel('Description:').fill('Updated description')
  await page.getByLabel('Description:').press('End')
  await expect.poll(async () => (await storedProject(page)).title).toBe('Updated project')
  await expect.poll(async () => (await storedProject(page)).url).toBe('https://example.com')
  await expect.poll(async () => (await storedProject(page)).description).toBe('Updated description')
  await page.getByRole('button', { name: 'Colors', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Colors for Updated project' })).toBeVisible()
  await page.getByLabel('Background primary value', { exact: true }).fill('#123456')
  await page.getByLabel('Dark Background primary value', { exact: true }).fill('#654321')
  await page.getByRole('button', { name: 'Users', exact: true }).click()
  await expect(page.locator('article')).toContainText('Users 1')
  await page.getByRole('button', { name: 'Colors', exact: true }).click()
  await expect(page.getByLabel('Background primary value', { exact: true })).toHaveValue('#123456')
  await expect(page.getByLabel('Dark Background primary value', { exact: true })).toHaveValue('#654321')
  await page.getByRole('button', { name: 'Summery', exact: true }).click()
  await expect(page.locator('article')).toContainText('Updated project')
})

test('unknown project shows an explicit not-found message', async ({ authenticatedPage: page }) => {
  await page.goto('/project?p=missing')
  await expect(page.getByText('Oops! Project not found.')).toBeVisible()
})

test('editor without a project shows its empty state', async ({ authenticatedPage: page }) => {
  await page.goto('/editor')
  await expect(page.getByText('No project selected')).toBeVisible()
  await expect(page.getByRole('button', { name: /Add Page/ })).toHaveCount(0)
})

test('editor loads fresh defaults when not resuming local data', async ({ authenticatedPage: page }) => {
  await page.goto('/editor?p=1')
  await expect(page.locator('.page-button')).toHaveText(['draftStart page'])
  await expect(preview(page).locator('main section')).toHaveCount(0)
})

test('bare preview handles missing page and project data', async ({ page }) => {
  await page.goto('/preview/')
  await expect(page).toHaveTitle('Preview')
  await expect(page.locator('main')).toBeEmpty()
  await expect(page.getByRole('navigation', { name: 'Project menu' })).toBeAttached()
  await expect(page.getByRole('contentinfo', { name: 'Project footer' })).toHaveClass(/footer-empty/)
})

test('preview GET renders every content block and project chrome', async ({ page, project }) => {
  await openPreview(page, project)
  await expect(page.locator('main section')).toHaveCount(5)
  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'A heading', level: 2 })).toBeVisible()
  await expect(page.getByRole('img', { name: 'A landscape' })).toHaveAttribute('src', '/favicon.svg')
  await expect(page.locator('figcaption')).toHaveText('Original caption')
  await expect(page.locator('main').getByRole('link', { name: 'Read more' })).toHaveCount(2)
  await expect(page.getByRole('img', { name: 'Feature image' })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Project menu' }).getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('href', '#page-home')
  await page.getByText('Explore', { exact: true }).click()
  // Preview clicks select the global menu rather than following/toggling its items.
  await expect(page.locator('details a')).toHaveText('Docs')
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('selectedElement') ?? 'null').data.type)).toBe('menu')
  await expect(page.getByRole('link', { name: 'Child page', exact: true })).toHaveAttribute('href', '#page-child')
  const footer = page.getByRole('contentinfo', { name: 'Project footer' })
  await expect(footer).toContainText('Test copyright')
  await expect(footer.locator('strong')).toHaveText('Footer note')
  for (const name of ['Contact', 'github']) {
    await expect(footer.getByRole('link', { name, exact: true })).toHaveAttribute('target', '_blank')
    await expect(footer.getByRole('link', { name, exact: true })).toHaveAttribute('rel', 'noopener noreferrer')
  }
})

test('editor POST preview handles content larger than a URL payload', async ({ page, project }) => {
  const content = 'Long page content. '.repeat(2000)
  project.pages[0].content[0].content = content
  await seedProject(page, project)
  const responsePromise = page.waitForResponse((response) => new URL(response.url()).pathname === '/preview/' && response.request().method() === 'POST')
  await page.goto('/editor?p=1&local=true')
  const response = await responsePromise
  expect(response.status()).toBe(200)
  const form = new URLSearchParams(response.request().postData() ?? '')
  expect(JSON.parse(form.get('data') ?? 'null').content[0].content).toBe(content)
  expect(JSON.parse(form.get('settings') ?? 'null').id).toBe(project.id)
  await expect(preview(page).locator('section[data-id="text"] p')).toHaveText(content.trim())
  expect(new URL(response.url()).searchParams.has('data')).toBe(false)
})

test('mobile preview stacks Split Block without horizontal overflow', async ({ page, project }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openPreview(page, project)
  const text = await page.locator('.split-text').boundingBox()
  const image = await page.locator('.split-image').boundingBox()
  expect(text).not.toBeNull()
  expect(image).not.toBeNull()
  expect(image!.y + image!.height).toBeLessThanOrEqual(text!.y + 1)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
})

for (const route of ['/404', '/does-not-exist']) {
  test(`${route} renders the 404 page with working navigation`, async ({ page }) => {
    const response = await page.goto(route)
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
    await page.getByRole('link', { name: 'Home', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'SCMS' })).toBeVisible()
  })
}
