const mongoose = require('mongoose')

const siteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Title is Required'
  },
  imageUrl: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Blog', siteSchema)