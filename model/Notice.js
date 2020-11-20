const mongoose = require('mongoose')

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Title is Required'
  },
  date: {
    type: Date,
    required: true
  },
  
  imageUrl: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Notice', noticeSchema)