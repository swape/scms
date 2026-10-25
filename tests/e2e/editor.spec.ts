import { expect, preview, storedProject, test } from './fixtures'

test('Page settings update title, order, palette, and persist on reload', async ({ editorPage: page }) => {
  await page.locator('.page-button').filter({ hasText: 'Home page' }).click()
  await page.getByLabel('Title:', { exact: true }).fill('Renamed home')
  await page.getByLabel('Order:', { exact: true }).fill('3')
  await page.getByLabel('Page background color:').selectOption('bg_2')
  await page.getByLabel('Page text color:').selectOption('text_2')
  await expect
    .poll(async () => (await storedProject(page)).pages[0])
    .toMatchObject({
      title: 'Renamed home',
      order: 3,
      colors: { backgroundColorKey: 'bg_2', textColorKey: 'text_2' },
    })
  await expect(preview(page).locator('body')).toHaveCSS('background-color', 'rgb(241, 245, 249)')
  await expect(preview(page).locator('body')).toHaveCSS('color', 'rgb(71, 85, 105)')
  await page.reload()
  await expect(page.locator('.page-button').filter({ hasText: 'Renamed home' })).toBeVisible()
  await expect(preview(page).locator('body')).toHaveCSS('background-color', 'rgb(241, 245, 249)')
})

test('pages and subpages can be added and recursively deleted', async ({ editorPage: page }) => {
  await page.getByRole('button', { name: /Add Page$/ }).click()
  await expect(page.getByLabel('Title:', { exact: true })).toHaveValue('New Page 5')
  await expect.poll(async () => (await storedProject(page)).pages.length).toBe(5)
  const row = page.locator('li').filter({ has: page.locator('.page-button', { hasText: 'New Page 5' }) })
  await row.locator('.submenu-button').click()
  await row.getByRole('button', { name: /Add Subpage$/ }).click()
  await expect(page.getByLabel('Title:', { exact: true })).toHaveValue('New Page 1')
  await expect.poll(async () => (await storedProject(page)).pages.length).toBe(6)
  const project = await storedProject(page)
  expect(project.pages[5].parentId).toBe(project.pages[4].id)
  await row.locator(':scope > div > .submenu-button').click()
  page.once('dialog', (dialog) => dialog.accept())
  await row
    .locator(':scope > div > .submenu')
    .getByRole('button', { name: /Delete$/ })
    .click()
  await expect.poll(async () => (await storedProject(page)).pages.length).toBe(4)
  await expect(page.locator('.page-button', { hasText: 'New Page' })).toHaveCount(0)
})

test('canceling page deletion preserves the page and its children', async ({ editorPage: page }) => {
  const row = page.locator('li').filter({ has: page.locator('.page-button', { hasText: 'Home page' }) })
  await row.locator(':scope > div > .submenu-button').click()
  page.once('dialog', (dialog) => dialog.dismiss())
  await row
    .locator(':scope > div > .submenu')
    .getByRole('button', { name: /Delete$/ })
    .click()
  expect((await storedProject(page)).pages).toHaveLength(4)
  await expect(page.locator('.page-button', { hasText: 'Child page' })).toBeVisible()
})

test('content drag-and-drop updates preview order and persists normalized order', async ({ editorPage: page }) => {
  const source = page.locator('.project-items li[draggable]').filter({ has: page.locator('[data-id="text"]') })
  const target = page.locator('.project-items li[draggable]').filter({ has: page.locator('[data-id="header"]') })
  await source.dragTo(target)
  const expected = ['header', 'text', 'image', 'link', 'splitBlock']
  await expect.poll(async () => (await storedProject(page)).pages[0].content.map((block) => block.id)).toEqual(expected)
  expect((await storedProject(page)).pages[0].content.map((block) => block.order)).toEqual([1, 2, 3, 4, 5])
  await expect
    .poll(() =>
      preview(page)
        .locator('main section')
        .evaluateAll((sections) => sections.map((section) => section.getAttribute('data-id')))
    )
    .toEqual(expected)
  await page.reload()
  await expect
    .poll(() =>
      preview(page)
        .locator('main section')
        .evaluateAll((sections) => sections.map((section) => section.getAttribute('data-id')))
    )
    .toEqual(expected)
})

test('canceling block deletion preserves content', async ({ editorPage: page }) => {
  const row = page.locator('.project-items li[draggable]').filter({ has: page.locator('[data-id="text"]') })
  page.once('dialog', (dialog) => dialog.dismiss())
  await row.getByRole('button', { name: 'delete', exact: true }).click()
  expect((await storedProject(page)).pages[0].content).toHaveLength(5)
  await expect(preview(page).locator('section[data-id="text"]')).toBeVisible()
})

test('dark mode updates preview palette and survives reload', async ({ editorPage: page }) => {
  await page.locator('.page-button', { hasText: 'Home page' }).click()
  await page.getByLabel('Page background color:').selectOption('bg_1')
  await expect(preview(page).locator('body')).toHaveCSS('background-color', 'rgb(248, 250, 252)')
  await page.getByRole('button', { name: /Toggle Dark Mode$/ }).click()
  await expect(preview(page).locator('body')).toHaveCSS('background-color', 'rgb(15, 23, 42)')
  await page.reload()
  await expect(preview(page).locator('body')).toHaveCSS('background-color', 'rgb(15, 23, 42)')
  await page.getByRole('button', { name: /Toggle Dark Mode$/ }).click()
  await expect(preview(page).locator('body')).toHaveCSS('background-color', 'rgb(248, 250, 252)')
})

for (const name of ['save Save', 'save Save and Publish']) {
  test(`${name} explicitly reports unimplemented publishing`, async ({ editorPage: page }) => {
    const dialogPromise = page.waitForEvent('dialog').then(async (dialog) => {
      const message = dialog.message()
      await dialog.accept()
      return message
    })
    await page.getByRole('button', { name, exact: true }).click()
    expect(await dialogPromise).toBe('Save functionality not implemented yet')
  })
}
