const express = require('express')
const mongoose = require('mongoose')
const Blog = require('./models/blog')

const app = express()

const { PORT } = require('./utils/config')

const connectToDatabase = async () => {
  try {
    const mongoUrl = 'mongodb://localhost:27017/bloglist'
    console.log(`Using in-memory MongoDB at: ${mongoUrl}`)

    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err)
    })

    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 120000,
      socketTimeoutMS: 180000,
      connectTimeoutMS: 120000,
      retryWrites: true,
      retryReads: true,
      poolSize: 30,
      bufferCommands: false,
      connectWithNoPrimary: false,
      heartbeatFrequencyMS: 2000,
      family: 4,
      keepAlive: true,
      keepAliveInitialDelay: 300000,
      waitQueueTimeoutMS: 90000,
      maxIdleTimeMS: 60000,
      minPoolSize: 10,
      directConnection: true
    }

    await mongoose.connect(mongoUrl, connectionOptions)
    mongoose.set('bufferCommands', false)

    await Blog.createIndexes()
    console.log('Successfully connected to MongoDB')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message)
    console.log('Please make sure MongoDB is running')
    console.log('You can:')
    console.log('1. Install MongoDB locally (https://docs.mongodb.com/manual/installation/)')
    console.log('2. Use a cloud MongoDB service like MongoDB Atlas')
    console.log('3. Set MONGODB_URI environment variable to your connection string')
    process.exit(1)
  }
}

const MAX_RETRIES = 3
const RETRY_DELAY = 2000
let retryCount = 0

const startServer = async () => {
  try {
    await connectToDatabase()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      retryCount++
      console.log(`Connection failed. Retrying (${retryCount}/${MAX_RETRIES})...`)
      setTimeout(startServer, RETRY_DELAY)
    } else {
      console.error('Failed to connect to MongoDB after multiple attempts')
      process.exit(1)
    }
  }
}

startServer()

app.use(express.json())
app.use('/api/blogs', require('./controllers/blogs'))

