require('dotenv').config()

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost/bloglist',
  PORT: process.env.PORT || 3003
}
