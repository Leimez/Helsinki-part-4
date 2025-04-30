const express = require('express')
const Blog = require('../models/blog')
const router = express.Router()

router.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    response.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    })
  }
})

router.post('/', async (request, response) => {
  try {
    if (!request.body.title || !request.body.url) {
      return response.status(400).json({ 
        error: 'Title and URL are required' 
      })
    }
    
    const blog = new Blog({
      title: request.body.title,
      author: request.body.author || 'Unknown',
      url: request.body.url,
      likes: request.body.likes || 0
    })
    
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    console.error('Error saving blog:', error)
    response.status(400).json({ 
      error: 'Bad request',
      details: error.message 
    })
  }
})

router.delete('/:id', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (error) {
    console.error('Error deleting blog:', error)
    response.status(400).json({ 
      error: 'Bad request',
      details: error.message 
    })
  }
})

router.put('/:id', async (request, response) => {
  try {
    const { likes } = request.body
    if (likes === undefined) {
      return response.status(400).json({ error: 'Likes count is required' })
    }
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes },
      { new: true, runValidators: true, context: 'query' }
    )
    if (!updatedBlog) {
      return response.status(404).json({ error: 'Blog not found' })
    }
    response.json(updatedBlog)
  } catch (error) {
    console.error('Error updating blog:', error)
    response.status(400).json({ 
      error: 'Bad request',
      details: error.message 
    })
  }
})

module.exports = router
