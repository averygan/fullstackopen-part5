import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  const handleBlogChange = (event) => {
    const { name, value } = event.target
    setNewBlog({ ...newBlog, [name]: value })
  }

  const callCreateBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    })

    setNewBlog({ title: '', author: '', url: '' })
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={callCreateBlog}>
        <div>
            title:
          <input type ="text" data-testid='title' value={newBlog.title} name="title" onChange={handleBlogChange} placeholder='title'/>
        </div>
        <div>
            author:
          <input type ="text" data-testid='author' value={newBlog.author} name="author" onChange={handleBlogChange} placeholder='author'/>
        </div>
        <div>
            url:
          <input type ="text" data-testid='url' value={newBlog.url} name="url" onChange={handleBlogChange} placeholder='url'/>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm