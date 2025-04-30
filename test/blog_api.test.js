const mongoose = require('mongoose')
const supertest = require('supertest')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { app, connectToDatabase } = require('../index')
const Blog = require('../models/blog')

const api = supertest(app)

let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongoServer.getUri()
  process.env.NODE_ENV = 'test'
  await connectToDatabase()
})

beforeEach(async () => {
  await Blog.deleteMany({})
  const initialBlogs = [
    { title: 'First blog', author: 'Author1', url: 'http://example.com/1', likes: 1 },
    { title: 'Second blog', author: 'Author2', url: 'http://example.com/2', likes: 2 }
  ]
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json and correct amount', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toHaveLength(2)
})

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogs = response.body
  blogs.forEach(blog => {
    expect(blog.id).toBeDefined()
    expect(blog._id).toBeUndefined()
  })
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New blog',
    author: 'Author3',
    url: 'http://example.com/3',
    likes: 3
  }

  const blogsAtStartResponse = await api.get('/api/blogs')
  const blogsAtStart = blogsAtStartResponse.body

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEndResponse = await api.get('/api/blogs')
  const blogsAtEnd = blogsAtEndResponse.body

  expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain(newBlog.title)
})

afterAll(async () => {
  await mongoose.connection.close()
  await mongoServer.stop()
})
