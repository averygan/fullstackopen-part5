import { useState } from 'react'

const Blog = ({ blog }) => {
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
        <div>likes: {blog.likes}</div>
        <div>User: {blog.user.name}</div>
      </div>
    </div>
  )
}

export default Blog