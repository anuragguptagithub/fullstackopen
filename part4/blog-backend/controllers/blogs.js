const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs.map(blog => blog.toJSON()))

  })

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate('user')
    response.json(blog.toJSON())
  })  
  
blogsRouter.post('/', async (request, response) => {
    
  let blog = request.body

  const user = request.user
  if (!user){
    return response.status(401).json({
      error: 'Not a valid user'
    })
  }
  blog = new Blog({...blog, user: user.id})

  savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()

  response.status(201).json(savedBlog)
  })

blogsRouter.delete('/:id', async (request, response) => {

  const blog = await Blog.findById(request.params.id)
  const user = request.user
  if (!user){
    return response.status(401).json({
      error: 'Not a valid user'
    })
  }
  
  if ( blog.user.toString() === user.id.toString() ){
    user.blogs = user.blogs.filter(blogid => blogid.toString() !== request.params.id)
      await Blog.findByIdAndDelete(request.params.id)
      await user.save()
      response.status(204).end()
    }   
})

blogsRouter.put('/:id', async (request, response) => {

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
    response.status(201).json(updatedBlog)
})
  

module.exports = blogsRouter