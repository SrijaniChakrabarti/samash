const express = require('express')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()
const cloudinary = require('cloudinary')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const formidable = require('formidable')
const fs = require('fs')

const authemail = "samashrayatrust@gmail.com"
const authpass ="Tatai@167"


require('./mongo.js')
require('./model/Blog')
require('./model/Gallery')
require('./model/adminauth')


require('./handlers/cloudinary')
const upload = require('./handlers/multer')
const gallerYupload = require('./handlers/multerGallery')


const AdminLogin = require('./routes/AdminLogin')
const contact = require('./routes/contact')
const notice = require('./routes/notice')
const gallery = require('./routes/gallery')
const adminForm = require('./routes/adminForm')

const Blog = mongoose.model('Blog')
const Gallery = mongoose.model('Gallery')
const adminauth = mongoose.model('adminauth')



app.engine('handlebars', exphbs({
	handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main' }))

app.set('view engine', 'handlebars')


app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }))

app.use('/AdminLogin', AdminLogin)
app.use('/contact', contact)
app.use('/notice', notice)


app.get('/adminForm', async (req, res) => {
	const adminForm = await adminauth.find({})
  res.render('adminForm',{
    adminForm
  })
})

app.get('/blogs', async (req, res) => {
  const blogs = await Blog.find({})
  res.render('blogs', {
    blogs
  })
})

app.get('/gallery', async (req, res) => {
  const gallery = await Gallery.find({})
  res.render('gallery', {
    gallery
  })
})


app.post('/create_blog', upload.single('image'), async (req, res) => {
  const result = await cloudinary.v2.uploader.upload(req.file.path)
  const blog = new Blog()
  blog.title = req.body.title
  blog.imageUrl = result.secure_url
  blog.image_id = result.public_id
  await blog.save()
  res.send({
    message: 'Blog is Created',
    image_id: blog.image_id
  })
})

app.post('/upload-for-gallery', gallerYupload.single('image'), async (req, res) => {
  const result = await cloudinary.v2.uploader.upload(req.file.path)
  const gal = new Gallery()
  gal.imageUrl = result.secure_url
  gal.image_id = result.public_id
  await gal.save()
  res.send({
    message: 'Gallery is Created',
    image_id: gal.image_id
  })
})

app.post('/login', async( req, res) => {
  const auth = new adminauth()
  auth.email = req.body.email
  auth.password = req.body.password
  await auth.save()

  if((authemail === auth.email)&&(authpass === auth.password))
  {
    res.redirect('/adminForm')
  }
  else
  {
    res.send({
      message:"email/password is incorrect"
    })
    res.redirect('/AdminLogin')
  }

})

const port = 3000

app.listen(port, () => {
     console.log(`Server is running at ${port}`)
     })