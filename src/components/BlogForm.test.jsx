import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('blogForm component', () => {
  test('updates parent state and calls onSubmit', async() => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByPlaceholderText('title')
    const authorInput = screen.getByPlaceholderText('author')
    const urlInput = screen.getByPlaceholderText('url')
    const submitButton = screen.getByText('create')

    await user.type(titleInput, 'dummy title')
    await user.type(authorInput, 'harrow')
    await user.type(urlInput, 'www.ninth.com')
    await user.click(submitButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('dummy title')
    expect(createBlog.mock.calls[0][0].author).toBe('harrow')
    expect(createBlog.mock.calls[0][0].url).toBe('www.ninth.com')

  })
})