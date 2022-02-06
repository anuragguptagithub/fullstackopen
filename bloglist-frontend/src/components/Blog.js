import React from 'react'
import { useState } from 'react'

const Blog = ({ blog, incrementLikes, handleDelete, id }) => {

  const [viewBlog, setViewBlog] = useState('view')

  const showWhenView = { display: viewBlog === 'view' ? 'none' : '' }

  const handleView = () => {
    setViewBlog(viewBlog === 'view' ? 'hide': 'view')
  }

  const removeButtonStyle = {
    paddingTop: 1,
    paddingLeft: 1,
    border: 'solid',
    color: 'white',
    background: '#1E90FF',
    borderWidth: 1,
    marginBottom: 2,
    display: (id).toString() === blog.user.id?.toString() ? '' : 'none'
  }
  const blogView = () => {
    return(
      <div style = {showWhenView} className='blogsDetail'>
        <div>{blog.title} {blog.author} <button onClick={handleView}>{viewBlog}</button></div>
        <li>{blog.url}</li>
        <li><button id='likesButton' onClick={() => incrementLikes(blog)}>likes</button> <em id="likes">{blog.likes}</em></li>
        <li>{blog.author}</li>
        <button id="removeButton" style = {removeButtonStyle} onClick={() => handleDelete(blog.id)}>remove</button>
      </div>
    )
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className='blogs'>
      {
        viewBlog === 'view'?
          <div className='blogsView'>{blog.title} {blog.author} <button id='viewBlog' onClick={handleView}>{viewBlog}</button></div>
          :blogView()
      }
    </div>
  )
}

export default Blog