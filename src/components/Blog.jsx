import { useState } from 'react'
import likeService from '../services/like'
import blogService from '../services/blogs'

const Blog = ({ blog, setNotification, blogState, setBlogs, compareLikes}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = async (id) => {
    try {
      const allBlogs = await blogService.getAll()
      const updatedBlog = allBlogs.find(blog => blog.id === id)
      if (updatedBlog) {
        const updatedBlogs = blogState.map(blog => blog.id === id ? updatedBlog : blog)
        const sortedBlogs = [...updatedBlogs].sort(compareLikes);
        setBlogs(sortedBlogs);
      }
    } catch (error)
    {}
  }

  const addLike = async (blogObject) => {
    try {
      // destructure id and user from blogobject, add the rest to updatedBlog
      const {id, user, ...updatedBlog} = blogObject
      updatedBlog.likes = updatedBlog.likes + 1
      const response = await likeService.like(id, updatedBlog)
      handleLike(id)
      setNotification(`like added to "${blogObject.title}"`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      setNotification(`Failed to add like to "${blogObject.title}". Please try again.`);
      setTimeout(() => {
        setNotification(null);
      }, 5000)
    }
  }

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
      {/* when not visible -> show title and view button */}
      <div style={hideWhenVisible}>
        {blog.title} <button onClick={toggleVisibility}>view</button>
      </div>

      {/* when visible -> show details and hide button */}
      <div style={showWhenVisible}>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button>
        <div>URL: {blog.url}</div>
        <div>likes: {blog.likes} <button onClick={() => addLike(blog)}>like</button></div>
        <div>User: {blog.user.name}</div>
      </div>
    </div>
  )
}

export default Blog