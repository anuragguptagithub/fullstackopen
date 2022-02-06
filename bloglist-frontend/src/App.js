import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [notificationMessage, setNotificationMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect( () => {
    blogService.getAll().then(initialBlogs => {
      console.log(initialBlogs)
      setBlogs(initialBlogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
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
        username, password })

      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationMessage('Wrong credentials')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h1>log in to application</h1>
      <div>
        username
        <input
          id="username"
          type="text"
          value={username}
          name="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">login</button>
    </form>
  )

  const addBlog = async (newBlog) => {

    try {
      const addedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(addedBlog))
      setNotificationMessage('blog successfully created with id: '+ addedBlog.id)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (error) {
      setNotificationMessage('Error creating blog: error - ' + error.message)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }

  }

  const handleDelete = async (id) => {
    if( window.confirm('Do you want to delete it ?')){
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter((blog) => blog.id !== id ))
      } catch (error) {
        setNotificationMessage('Error removing blog: error - ' + error.message)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      }
    }
  }
  const incrementLikes = async (blogToUpdate) => {

    const blogToSend = {
      ...blogToUpdate,
      likes: blogToUpdate.likes === undefined ? 1 : blogToUpdate.likes  + 1,
    }
    try {
      const updatedBlog = await blogService.update(blogToSend.id, { ...blogToSend, user: blogToUpdate.user.id })
      setBlogs(blogs.map((blog) => blog.id === updatedBlog.id ? blogToSend : blog))
    } catch (error) {
      setNotificationMessage('Error updating blog: error - ' + error.message)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const blogAddForm = () => {
    return(
      <Togglable buttonLabel = "create new blog">
        <BlogForm addBlog={addBlog}/>
      </Togglable> )
  }

  const sortBlogsByLikes = () => {
    let sortedBlogs = blogs.concat()
    sortedBlogs.sort((blogA, blogB) => {

      blogA.likes = blogA.likes ? blogA.likes : 0
      blogB.likes = blogB.likes ? blogB.likes : 0

      return blogB.likes - blogA.likes
    } )
    setBlogs(sortedBlogs)
  }

  return (
    <div>
      <Notification message={notificationMessage} />
      {
        user === null ?
          loginForm() :
          <div>
            <div id="blogsList">
              <h2>blogs</h2>
              <p>{user.name} logged-in <button onClick={handleLogout}>logout</button></p>
              <button id="sortButton" onClick={sortBlogsByLikes}>Sort By Likes</button>
              { blogs.map(blog => <Blog key={blog.id}
                blog={blog}
                incrementLikes={incrementLikes}
                handleDelete={handleDelete}
                id={user.id}/>) }
            </div>
            {blogAddForm()}
          </div>
      }</div>
  )
}

export default App