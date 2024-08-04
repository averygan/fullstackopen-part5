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
  await request.post('/api/users', {
    data: {
      name: 'Dummy',
      username: 'dummy',
      password: 'test123'
    }
  })
  await page.getByRole('button', { name: 'logout' }).click()
  await loginWith(page, 'dummy', 'test123')
}

const loginToken = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
  await page.waitForTimeout(1000)
  const loggedUser = await page.evaluate(() => localStorage.getItem('loggedUser'))
  return loggedUser ? JSON.parse(loggedUser).token : null
}

const createBlogWithToken = async (request, title, author, url, likes, token) => {
  const response = await request.post('/api/blogs', {
    headers: {
      'content-type': 'application/json',
      'authorization' : `Bearer ${token}`
    },
    data: {
      'title' : title,
      'author' : author,
      'url' : url,
      'likes' : likes
    }
  })
}

export { loginWith, createBlog, loginDummy, loginToken, createBlogWithToken }