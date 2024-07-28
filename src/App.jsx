import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addBlog = async (blogObject) => {
    try {
      const response = await blogService.create(blogObject)
      setNotification(`${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      setBlogs(blogs.concat(response))
    } catch (exception) {
        setErrorMessage(exception.response?.data?.error || 'error occurred adding blog')
        setTimeout(() => {
          setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    blogService.setToken(null)
  }

  const userInfo = () => (
    <div>
      <p>
        {user.name} logged in 
        <button onClick={handleLogout}>logout</button>
      </p>
    </div>
  )

  const loginForm = () => (
    <Togglable buttonLabel='login'>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  const blogForm = () => (
    <Togglable buttonLabel='create new'>
      <BlogForm createBlog={addBlog}/>
    </Togglable>
  )

  return (
    <div>
      <h1>blogs</h1>
      {notification && <div className="notification">{notification}</div>}
      {errorMessage && <div className="error">{errorMessage}</div>}
      {user === null && loginForm()}
      {user !== null && userInfo()}
      {user !== null && blogForm()}
    
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App