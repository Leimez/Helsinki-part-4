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

beforeEach((done) => {
  Blog.deleteMany({})
    .then(() => {
      const initialBlogs = [
        { title: 'First blog', author: 'Author1', url: 'http://example.com/1', likes: 1 },
        { title: 'Second blog', author: 'Author2', url: 'http://example.com/2', likes: 2 }
      ]
      return Blog.insertMany(initialBlogs)
    })
    .then(() => done())
})

test('blogs are returned as json and correct amount', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toHaveLength(2)
})

afterAll(async () => {
  await mongoose.connection.close()
  await mongoServer.stop()
})
