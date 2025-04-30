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

test('if likes property is missing, it will default to 0', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Author4',
    url: 'http://example.com/4'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toBe(0)
})

test('blog without title is not added and returns 400', async () => {
  const newBlog = {
    author: 'Author5',
    url: 'http://example.com/5',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('blog without url is not added and returns 400', async () => {
  const newBlog = {
    title: 'Blog without url',
    author: 'Author6',
    likes: 6
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStartResponse = await api.get('/api/blogs')
    const blogsAtStart = blogsAtStartResponse.body
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEndResponse = await api.get('/api/blogs')
    const blogsAtEnd = blogsAtEndResponse.body

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).not.toContain(blogToDelete.title)
  })

  test('fails with status code 404 if blog does not exist', async () => {
    const validNonexistingId = await new Blog({ title: 'willremovethissoon', url: 'http://tempurl.com' }).save()
    await Blog.findByIdAndRemove(validNonexistingId._id)

    await api
      .delete(`/api/blogs/${validNonexistingId._id}`)
      .expect(404)
  })

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = '12345invalidid'

    await api
      .delete(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
  await mongoServer.stop()
})
