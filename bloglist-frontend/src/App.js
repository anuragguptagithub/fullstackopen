import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog,setNewBlog] = useState({title: '', author: '', url: ''})
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
          type="text"
          value={username}
          name="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const addBlog = async (event) => {
    
    event.preventDefault()
    
    try {
      const addedBlog = await blogService.create(newBlog) 
      setBlogs(blogs.concat(addedBlog))
      setNewBlog({title:'',author:'',url:''})
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

  return (
    <div>
      <Notification message={notificationMessage} />
      {
      user === null ?
        loginForm() :
        <><div>

            <h2>blogs</h2>
            <p>{user.name} logged-in <button onClick={handleLogout}>logout</button></p>
            {blogs.map(blog => <Blog key={blog.id} blog={blog} />
            )}
          </div>
          <div>
            <h1>Create New Blog</h1>
            <p/>
            <form onSubmit={addBlog}>
              title: <input name="title" value = {newBlog?.title}  
              onChange={({ target }) => setNewBlog({...newBlog, title: target.value})}/><br/>

              author: <input name="author" value = {newBlog?.author} 
              onChange={({ target }) => setNewBlog({...newBlog, author: target.value})}/><br/>

              url: <input name="url" value = {newBlog?.url} 
              onChange={({ target }) => setNewBlog({...newBlog, url: target.value})}/><br/>
              <button type="submit">save</button>
             </form> 
          </div></>
    }</div>
  )
}

export default App