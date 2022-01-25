const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('../utils/test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')
var token = ''
jest.setTimeout(50000)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'pragsmatic',
      name: 'Anurag Gupta',
      password: 'master',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with an invalid username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'pr',
      name: 'An',
      password: 'master',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).not.toContain(newUser.username)
  })
})

describe('blogs tests',() => {

beforeEach( async () => {
    await Blog.deleteMany({});
    
    const user = {
        "username":"root",
        "password":"sekret"
        }  
    const tokenResult = await api
                        .post('/api/login')
                        .send(user)
    token = 'Bearer ' + tokenResult.body.token    
    
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog({...blog,user: tokenResult.body.id})
      await blogObject.save()
    }                    
                            
})  
    
test('Verify the get blogs', async () => {
    const result = await api.get('/api/blogs')
    expect(result.body).toHaveLength(helper.initialBlogs.length) 
})

test('Verify the id', async () => {
    const result = await api.get('/api/blogs')
    expect(result.body[0].id).toBeDefined()
})

test('Add a blog', async () => {

    let newBlog = {
                            title: "First class tests",
                            author: "Robert C. Martin",
                            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
                            likes: 10,
                            }
    await api
        .post('/api/blogs')
        .set({ 'Authorization': token })
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()    
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(n => n.title)
    expect(titles).toContain(
      'Canonical string reduction'
    )

})

test('verify 400 Bad Request',async () => {
    let newBlog = new Blog({
        author: "Robert C. Martin",
        likes: 10,
        })
    
    await api
        .post('/api/blogs')
        .set({ 'Authorization': token })
        .send(newBlog)
        .expect(400)

})

test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ 'Authorization': token })
      .expect(204)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
  
    const titles = blogsAtEnd.map(r => r.titles)
    expect(titles).not.toContain(blogToDelete.title)
  })

  test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    let blogToUpdate = blogsAtStart[0]
    blogToUpdate.likes++
    const updatedBlog = await api
                              .put(`/api/blogs/${blogToUpdate.id}`)
                              .set({ 'Authorization': token })
                              .send(blogToUpdate)
  
    expect(updatedBlog.body.likes).toBe(blogToUpdate.likes)
  })  
})


afterAll(() => {
    mongoose.connection.close()
})

