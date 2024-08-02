import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setNotification, setError, blogState, setBlogs, addLike, loggedInUser }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const deleteBlog = async (blogObject) => {
    if (!loggedInUser.username) {
      return alert('Login required to delete blogs')
    }
    if (blogObject.user.username === loggedInUser.username) {
      if (confirm(`Remove ${blogObject.title}?`)) {
        const response = await blogService.deleteBlog(blogObject.id)
        // successful deletion returns no response body
        if (!response) {
          setBlogs(blogState.filter(blog => blog.id !== blogObject.id))
          setNotification(`"${blogObject.title}" deleted successfully`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        } else {
          setError(`failed to delete "${blogObject.title}"`)
          setTimeout(() => {
            setError(null)
          }, 5000)
        }
      }
      return
    }
    setError(`not authorized to delete "${blogObject.title}"`)
    setTimeout(() => {
      setError(null)
    }, 5000)
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle} className='bloglist'>
      {/* when not visible -> show title and view button */}
      <div style={hideWhenVisible}>
        <span>{blog.title} </span>
        <span>{blog.author}</span>
        <button onClick={toggleVisibility}>view</button>
      </div>

      {/* when visible -> show details and hide button */}
      <div style={showWhenVisible} className="togglableContent">
        {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button>
        <div>URL: {blog.url}</div>
        <div>Likes: {blog.likes} <button onClick={() => addLike(blog)}>like</button></div>
        <div>User: {blog.user.name}</div>
        <div>
          {loggedInUser && (
            <button onClick={() => deleteBlog(blog)}>
            delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Blog