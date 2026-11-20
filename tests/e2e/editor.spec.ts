import { readFile } from 'node:fs/promises'
import { expect, preview, storedProject, test } from './fixtures'

test('settings drag over an expanded preview and pin back without losing edits', async ({ editorPage: page }) => {
  await preview(page).locator('section[data-id="text"]').click()
  const panel = page.getByRole('region', { name: 'Settings', exact: true })
  const content = panel.getByLabel('Content:', { exact: true })
  await expect(content).toBeVisible()
  const pinnedPanel = (await panel.boundingBox())!
  const pinnedPreview = (await page.locator('iframe[title="Preview"]').boundingBox())!

  await content.fill('Edits survive floating and pinning')
  await page.getByRole('button', { name: 'Float settings panel', exact: true }).click()
  await expect(panel.getByText('Floating', { exact: true })).toBeVisible()
  const expandedPreview = (await page.locator('iframe[title="Preview"]').boundingBox())!
  const floatingPanel = (await panel.boundingBox())!
  expect(expandedPreview.width).toBeGreaterThan(pinnedPreview.width)
  expect(floatingPanel.x).toBeLessThan(expandedPreview.x + expandedPreview.width)
  expect(floatingPanel.x + floatingPanel.width).toBeLessThan(page.viewportSize()!.width)
  await expect(content).toHaveValue('Edits survive floating and pinning')
  await expect(preview(page).locator('section[data-id="text"] p')).toHaveText('Edits survive floating and pinning')

  const handle = (await page.getByRole('button', { name: 'Move settings panel', exact: true }).boundingBox())!
  const startX = handle.x + handle.width / 2
  const startY = handle.y + handle.height / 2
  await page.mouse.move(startX, startY)
  await page.mouse.down()
  await page.mouse.move(startX, startY + 100, { steps: 5 })
  await page.mouse.up()
  const movedDown = (await panel.boundingBox())!
  expect(movedDown.y).toBeCloseTo(floatingPanel.y + 100, 0)
  expect(movedDown.x).toBeCloseTo(floatingPanel.x, 0)
  expect(movedDown.height).toBeCloseTo(floatingPanel.height, 0)

  await page.mouse.move(startX, startY + 100)
  await page.mouse.down()
  await page.mouse.move(startX - 160, startY - 64, { steps: 5 })
  await page.mouse.up()
  const movedPanel = (await panel.boundingBox())!
  expect(movedPanel.x).toBeCloseTo(floatingPanel.x - 160, 0)
  expect(movedPanel.y).toBeCloseTo(floatingPanel.y - 64, 0)
  expect(movedPanel.height).toBeCloseTo(floatingPanel.height, 0)
  await expect(content).toHaveValue('Edits survive floating and pinning')

  await page.getByRole('button', { name: 'Pin settings panel to side', exact: true }).click()
  await expect(panel.getByText('Pinned', { exact: true })).toBeVisible()
  const restoredPanel = (await panel.boundingBox())!
  const restoredPreview = (await page.locator('iframe[title="Preview"]').boundingBox())!
  expect(restoredPanel.x).toBeCloseTo(pinnedPanel.x, 0)
  expect(restoredPreview.width).toBeCloseTo(pinnedPreview.width, 0)
  await expect(content).toHaveValue('Edits survive floating and pinning')
  expect((await storedProject(page)).pages[0].content[0].content).toBe('Edits survive floating and pinning')
})

test('settings tabs preserve drafts and pending units with keyboard navigation', async ({ editorPage: page }) => {
  await preview(page).locator('section[data-id="text"]').click()
  const content = page.getByRole('tab', { name: 'Content', exact: true })
  const style = page.getByRole('tab', { name: 'Style', exact: true })
  const other = page.getByRole('tab', { name: 'Other settings', exact: true })
  await page.getByLabel('Content:', { exact: true }).fill('Draft survives switching tabs')
  await content.focus()
  await content.press('ArrowRight')
  await expect(style).toBeFocused()
  await expect(style).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByLabel('Content:', { exact: true })).toBeHidden()
  await page.getByLabel('Padding unit', { exact: true }).selectOption('ch')
  await style.focus()
  await style.press('End')
  await expect(other).toBeFocused()
  await expect(page.getByRole('tabpanel', { name: 'Other settings', exact: true })).toContainText('ID: text')
  await expect(page.getByLabel('Padding:', { exact: true })).toBeHidden()
  await other.press('ArrowLeft')
  await expect(page.getByLabel('Padding unit', { exact: true })).toHaveValue('ch')
  await page.getByLabel('Padding:', { exact: true }).fill('2')
  await style.focus()
  await style.press('Home')
  await expect(content).toBeFocused()
  await expect(page.getByLabel('Content:', { exact: true })).toHaveValue('Draft survives switching tabs')
  await expect(preview(page).locator('section[data-id="text"] p')).toHaveText('Draft survives switching tabs')
  await expect.poll(async () => (await storedProject(page)).pages[0].content[0].style?.paddingAll).toBe('2ch')
  await other.click()
  await page.locator('.layer-content[data-id="header"]').click()
  await expect(content).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByLabel('Text:', { exact: true })).toBeVisible()
})

test('Page settings update title, order, palette, and persist on reload', async ({ editorPage: page }) => {
  await page.locator('.page-button').filter({ hasText: 'Home page' }).click()
  await page.getByLabel('Title:', { exact: true }).fill('Renamed home')
  await page.getByRole('tab', { name: 'Other settings', exact: true }).click()
  await page.getByLabel('Order:', { exact: true }).fill('3')
  await page.getByRole('tab', { name: 'Style', exact: true }).click()
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
  await expect(preview(page).locator('main section')).toHaveCount(expected.length)
  for (const [index, id] of expected.entries()) {
    await expect(preview(page).locator('main section').nth(index)).toHaveAttribute('data-id', id)
  }
  await page.reload()
  await expect(preview(page).locator('main section')).toHaveCount(expected.length)
  for (const [index, id] of expected.entries()) {
    await expect(preview(page).locator('main section').nth(index)).toHaveAttribute('data-id', id)
  }
})

test('canceling block deletion preserves content', async ({ editorPage: page }) => {
  const row = page.locator('.project-items li[draggable]').filter({ has: page.locator('[data-id="text"]') })
  page.once('dialog', (dialog) => dialog.dismiss())
  await row.getByRole('button', { name: 'Delete Welcome', exact: true }).click()
  expect((await storedProject(page)).pages[0].content).toHaveLength(5)
  await expect(preview(page).locator('section[data-id="text"]')).toBeVisible()
})

test('dark mode updates preview palette and survives reload', async ({ editorPage: page }) => {
  await page.locator('.page-button', { hasText: 'Home page' }).click()
  await page.getByRole('tab', { name: 'Style', exact: true }).click()
  await page.getByLabel('Page background color:').selectOption('bg_1')
  await expect(preview(page).locator('body')).toHaveCSS('background-color', 'rgb(248, 250, 252)')
  await page.getByRole('button', { name: 'Toggle dark mode', exact: true }).click()
  await expect(preview(page).locator('body')).toHaveCSS('background-color', 'rgb(15, 23, 42)')
  await page.reload()
  await expect(preview(page).locator('body')).toHaveCSS('background-color', 'rgb(15, 23, 42)')
  await page.getByRole('button', { name: 'Toggle dark mode', exact: true }).click()
  await expect(preview(page).locator('body')).toHaveCSS('background-color', 'rgb(248, 250, 252)')
})

test('JSON export includes pending footer edits and restores a same-ID project', async ({ editorPage: page, project }) => {
  await preview(page).locator('[data-items="footer"]').click()
  const field = page.getByLabel('Text content', { exact: true })
  await expect(field).toBeVisible()
  await page.getByRole('button', { name: 'Save & load', exact: true }).click()
  const downloadPromise = page.waitForEvent('download')
  // Dispatch both actions in one task so the footer debounce cannot fire first.
  await field.evaluate((input) => {
    ;(input as HTMLInputElement).value = 'Latest footer draft'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    const saveButton = Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.includes('Save as JSON'))
    saveButton?.click()
  })
  const download = await downloadPromise
  await expect(page.getByRole('group', { name: 'Save and load actions', exact: true })).toBeHidden()
  const file = await download.path()
  expect(file).not.toBeNull()
  const exported = JSON.parse(await readFile(file!, 'utf8'))
  project.footer.elements[0].text = 'Latest footer draft'
  expect(exported).toEqual(project)

  await field.fill('Changed after backup')
  await expect.poll(async () => (await storedProject(page)).footer.elements[0].text).toBe('Changed after backup')
  await page.getByRole('button', { name: 'Save & load', exact: true }).click()
  const chooserPromise = page.waitForEvent('filechooser')
  await page.getByRole('button', { name: 'Load from JSON', exact: true }).click()
  page.once('dialog', (dialog) => dialog.accept())
  await (await chooserPromise).setFiles(file!)
  await expect(preview(page).getByRole('contentinfo')).toContainText('Latest footer draft')
  await expect.poll(() => storedProject(page)).toEqual(project)
  await preview(page).locator('[data-items="footer"]').click()
  await expect(page.getByLabel('Text content', { exact: true })).toHaveValue('Latest footer draft')
  await page.reload()
  await expect(preview(page).getByRole('contentinfo')).toContainText('Latest footer draft')
})

test('invalid JSON and cyclic pages leave the current draft unchanged', async ({ editorPage: page, project }) => {
  const upload = page.getByLabel('Project JSON file', { exact: true })
  await upload.setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{') })
  await expect(page.getByRole('alert')).toBeVisible()
  expect(await storedProject(page)).toEqual(project)

  const cyclic = structuredClone(project)
  cyclic.pages[0].parentId = cyclic.pages[1].id
  await upload.setInputFiles({ name: 'cyclic.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(cyclic)) })
  await expect(page.getByRole('alert')).toBeVisible()
  expect(await storedProject(page)).toEqual(project)
  await expect(preview(page).getByRole('heading', { name: 'Welcome', exact: true })).toBeVisible()
})

test('canceling an import preserves the draft and allows retrying the same file', async ({ editorPage: page, project }) => {
  const imported = structuredClone(project)
  imported.title = 'Imported project'
  imported.pages[0].content[0].content = 'Restored JSON content'
  const file = { name: 'project.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(imported)) }
  const upload = page.getByLabel('Project JSON file', { exact: true })
  const canceled = page.waitForEvent('dialog').then((dialog) => dialog.dismiss())
  await upload.setInputFiles(file)
  await canceled
  await page.getByRole('button', { name: 'Save & load', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Load from JSON', exact: true })).toBeEnabled()
  expect(await storedProject(page)).toEqual(project)

  page.once('dialog', (dialog) => dialog.accept())
  await upload.setInputFiles(file)
  await expect(preview(page).locator('section[data-id="text"] p')).toHaveText('Restored JSON content')
  await expect.poll(() => storedProject(page)).toEqual(imported)
})
