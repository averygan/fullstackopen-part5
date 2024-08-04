const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)

  // click login
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

const loginDummy = async(page, request) => {
  await request.post('http://localhost:3003/api/users', {
    data: {
      name: 'Dummy',
      username: 'dummy',
      password: 'test123'
    }
  })
  await page.getByRole('button', { name: 'logout' }).click()
  await loginWith(page, 'dummy', 'test123')
}

export { loginWith, createBlog, loginDummy }