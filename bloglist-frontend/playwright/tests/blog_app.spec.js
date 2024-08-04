const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, loginDummy, loginToken, createBlogWithToken } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // empty db
    await request.post('/api/testing/reset')
    // create a user
    await request.post('/api/users', {
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
      await loginWith(page, 'janed', 'test123')
      // check results
      await expect(page.getByText('Jane Doe logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'janed', 'wrong')
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'janed', 'test123')
    })

    test('a new blog can be created', async ({ page }) => {
      await loginWith(page, 'janed', 'test123')
      await createBlog(page, 'hubspot', 'avery g', 'www.test.com')
      await expect(page.getByText('hubspot by avery g added')).toBeVisible()
    })

    describe ('and a new blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'hubspot', 'avery g', 'www.test.com')
      })

      test('blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('Likes: 1')).toBeVisible()
      })

      test('blog can be deleted by user', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'delete' }).click()
        await expect(page.getByText('hubspot avery g')).toHaveCount(0)
      })

      test('delete button not visible for unauthorized user', async ({ page, request }) => {
        await loginDummy(page, request)
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'delete' })).toHaveCount(0)
      })
    })
  })

  describe('3 blogs with varying likes', () => {
    let token

    beforeEach(async ({ page, request }) => {
      token = await loginToken(page, 'janed', 'test123')

      await createBlogWithToken(request, 'highest blog', 'top author', 'www.test.com', 123, token)
      await createBlogWithToken(request, 'lowest blog', 'bot author', 'www.test.com', 2, token)
      await createBlogWithToken(request, 'mid blog', 'mid author', 'www.test.com', 20, token)

      await page.goto('http://localhost:5173')
    })

    test('check that three blogs are created', async ({ page }) => {
      // check that all 3 blogs are present
      await expect(page.locator('.bloglist >> text="highest blog"')).toContainText('highest blog')
      await expect(page.locator('.bloglist >> text="lowest blog"')).toContainText('lowest blog')
      await expect(page.locator('.bloglist >> text="mid blog"')).toContainText('mid blog')
    })

    test('check that blogs are sorted', async ({ page }) => {
      const blogEntries = page.locator('.bloglist')
      const firstBlog = blogEntries.nth(0)
      const secondBlog = blogEntries.nth(1)
      const thirdBlog = blogEntries.nth(2)

      await expect(firstBlog).toContainText('highest blog')
      await expect(secondBlog).toContainText('mid blog')
      await expect(thirdBlog).toContainText('lowest blog')
    })
  })
})