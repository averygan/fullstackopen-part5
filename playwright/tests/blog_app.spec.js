const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // empty db
    await request.post('http://localhost:3003/api/testing/reset')
    // create a user
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Jane Doe',
        username: 'janed',
        password: 'test123'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const userField = await page.getByTestId('username')
    const passField = await page.getByTestId('password')
    await expect(userField).toBeVisible()
    await expect(passField).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      // fill correct credentials
      await page.getByTestId('username').fill('janed')
      await page.getByTestId('password').fill('test123')

      // click login
      await page.getByRole('button', { name: 'login' }).click()

      // check results
      await expect(page.getByText('Jane Doe logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('janed')
      await page.getByTestId('password').fill('wrong')

      await page.getByRole('button', { name: 'login' }).click()

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
    })
  })
})