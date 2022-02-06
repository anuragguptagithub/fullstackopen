import React from 'react'
import { useState } from 'react'

const BlogForm = ({ addBlog }) => {

  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const addNewBlog = (event) => {

    event.preventDefault()

    addBlog(newBlog)
    setNewBlog({ title:'',author:'',url:'' })
  }
  return (
    <div>
      <h1>Create New</h1>
      <p/>
      <form onSubmit={addNewBlog}>
        title: <input id="title" name="title" value = {newBlog?.title}
          onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}/><br/>

        author: <input id="author" name="author" value = {newBlog?.author}
          onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}/><br/>

        url: <input id="url" name="url" value = {newBlog?.url}
          onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}/><br/>
        <button id="save" type="submit">save</button>
      </form>
    </div>
  )
}

export default BlogForm