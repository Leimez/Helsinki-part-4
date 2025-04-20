const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper_temp')

describe('favorite blog', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const listWithMultipleBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17fa',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 12,
      __v: 0
    }
  ]

  test('when list has only one blog returns that blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result, listWithOneBlog[0])
  })

  test('when list has multiple blogs returns the blog with most likes', () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs)
    assert.deepStrictEqual(result, listWithMultipleBlogs[2])
  })

  test('when list has multiple blogs with same likes returns one of them', () => {
    const listWithSameLikes = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Blog A',
        author: 'Author A',
        url: 'http://example.com/a',
        likes: 10,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f9',
        title: 'Blog B',
        author: 'Author B',
        url: 'http://example.com/b',
        likes: 10,
        __v: 0
      }
    ]
    const result = listHelper.favoriteBlog(listWithSameLikes)
    assert.ok(result._id === listWithSameLikes[0]._id || result._id === listWithSameLikes[1]._id)
  })
})

describe('most blogs', () => {
  const listWithMultipleBlogs = [
    {
      author: 'Robert C. Martin',
      title: 'Blog 1',
      likes: 2
    },
    {
      author: 'Robert C. Martin',
      title: 'Blog 2',
      likes: 3
    },
    {
      author: 'Michael Chan',
      title: 'Blog 3',
      likes: 5
    },
    {
      author: 'Robert C. Martin',
      title: 'Blog 4',
      likes: 1
    },
    {
      author: 'Edsger W. Dijkstra',
      title: 'Blog 5',
      likes: 4
    },
    {
      author: 'Michael Chan',
      title: 'Blog 6',
      likes: 2
    }
  ]

  test('when list has multiple blogs returns the author with most blogs and the count', () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs)
    assert.deepStrictEqual(result, { author: 'Robert C. Martin', blogs: 3 })
  })

  test('when list has multiple authors tied for most blogs returns one of them', () => {
    const listWithTie = [
      { author: 'Author A', title: 'Blog A' },
      { author: 'Author A', title: 'Blog B' },
      { author: 'Author B', title: 'Blog C' },
      { author: 'Author B', title: 'Blog D' }
    ]
    const result = listHelper.mostBlogs(listWithTie)
    assert.ok(result.author === 'Author A' || result.author === 'Author B')
    assert.strictEqual(result.blogs, 2)
  })

  test('when list is empty returns null', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })
})
