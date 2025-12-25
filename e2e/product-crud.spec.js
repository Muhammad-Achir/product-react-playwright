import { test, expect } from '@playwright/test'

test.describe('Product CRUD', () => {
  const product = {
    name: `Laptop ${Date.now()}`,
    description: 'Laptop created by playwright',
    price: '1999',
    stock: '10',
  }

  test('Create product', async ({ page }) => {
    await page.goto('/')

    await page.fill('input[name="name"]', product.name)
    await page.fill('input[name="description"]', product.description)
    await page.fill('input[name="price"]', product.price)
    await page.fill('input[name="stock"]', product.stock)

    await page.click('button:has-text("Create")')

    await expect(
      page.locator('tbody tr', { hasText: product.name })
    ).toHaveCount(1)
  })

  test('Read product', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('table')).toBeVisible()

    const rowCount = await page.locator('tbody tr').count()
    expect(rowCount).toBeGreaterThan(0)
  })

  test('Update product', async ({ page }) => {
    await page.goto('/')

    const firstRow = page.locator('tbody tr').first()

    const oldName = await firstRow.locator('td').first().innerText()

    await firstRow.locator('button:has-text("Edit")').click()

    const updatedName = `${oldName} Updated ${Date.now()}`
    await page.fill('input[name="name"]', updatedName)

    await page.click('button:has-text("Update")')

    await page.waitForLoadState('networkidle')

    await expect(
      page.locator('tbody tr', { hasText: updatedName })
    ).toHaveCount(1)
  })



  test('Delete product', async ({ page }) => {
    await page.goto('/')

    const row = page.locator('tbody tr').first()

    const deletedName = await row.locator('td').first().innerText()

    page.once('dialog', async (dialog) => {
      await dialog.accept()
    })

    await row.locator('button:has-text("Delete")').click()

    await page.waitForLoadState('networkidle')

    await expect(
      page.locator('tbody tr', { hasText: deletedName })
    ).toHaveCount(0)
  })

})
