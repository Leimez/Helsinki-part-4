const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((prev, current) => {
    return (prev.likes > current.likes) ? prev : current
  }, {})
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorCounts = {}

  blogs.forEach(blog => {
    authorCounts[blog.author] = (authorCounts[blog.author] || 0) + 1
  })

  let maxBlogs = 0
  let maxAuthor = null

  for (const author in authorCounts) {
    if (authorCounts[author] > maxBlogs) {
      maxBlogs = authorCounts[author]
      maxAuthor = author
    }
  }

  return {
    author: maxAuthor,
    blogs: maxBlogs
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const likesCount = {}

  blogs.forEach(blog => {
    likesCount[blog.author] = (likesCount[blog.author] || 0) + (blog.likes || 0)
  })

  let maxLikes = 0
  let maxAuthor = null

  for (const author in likesCount) {
    if (likesCount[author] > maxLikes) {
      maxLikes = likesCount[author]
      maxAuthor = author
    }
  }

  return {
    author: maxAuthor,
    likes: maxLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
