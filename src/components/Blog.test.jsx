import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('blog component', () => {
  let container

  beforeEach(() => {
    const blog = {
      title: 'fake title',
      author: 'emma',
      url: 'www.google.com',
      likes: '100',
      user: {
        name: 'avery'
      }
    }

    container = render(<Blog blog={blog} />).container
  })

  test('title and author initially rendered', async () => {
    // Check that the title, author, and view button are initially visible
    const title = screen.getByText('fake title')
    const author = screen.getByText('emma')
    const view = screen.getByText('view')

    const url = screen.queryByText('www.google.com')
    const user = screen.queryByText('avery')
    const likes = screen.queryByText('100')

    expect(title).toBeDefined()
    expect(author).toBeDefined()
    expect(view).toBeDefined()

    expect(url).toBeNull()
    expect(user).toBeNull()
    expect(likes).toBeNull()
  })

  test('clicking view shows content', async () => {
    const view = screen.getByText('view')
    const user = userEvent.setup()
    await user.click(view)

    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')

    const url = screen.queryByText('www.google.com')
    const userName = screen.queryByText('avery')
    const likes = screen.queryByText('Likes: 100')

    expect(url).toBeDefined()
    expect(userName).toBeDefined()
    expect(likes).toBeDefined()
  })
})