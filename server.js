const express = require('express')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()
const cloudinary = require('cloudinary')
const mongoose = require('mongoose')
const formidable = require('formidable')
const fs = require('fs')
const multer = require('multer')
const http = require('http')


/*const {google} = require('googleapis')
const oAuth2data = require('./credentials.json')
const client_id = oAuth2data.web.client_id
const client_secret = oAuth2data.web.client_secret
const redirect_uris = oAuth2data.web.redirect_uris[0]
const oAuth2Client = new google.auth.OAuth2({
  client_id,
  client_secret,
  redirect_uris
})

var authed = false

const scope = " https://www.googleapis.com/auth/drive.file  https://www.googleapis.com/auth/userinfo.profile "*/

const authemail = "samashrayatrust@gmail.com"
const authpass ="Tatai@167"


require('./mongo.js')
require('./model/Blog')
require('./model/Gallery')
require('./model/adminauth')
require('./model/Notice')
require('./model/Post')


require('./handlers/cloudinary')
const upload = require('./handlers/multer')
const gallerYupload = require('./handlers/multerGallery')
const noticeupload = require('./handlers/multerNotice')
const blogpost = require('./handlers/multerPost')



const AdminLogin = require('./routes/AdminLogin')
const contact = require('./routes/contact')
const notice = require('./routes/notice')
const gallery = require('./routes/gallery')
const adminForm = require('./routes/adminForm')

const Blog = mongoose.model('Blog')
const Gallery = mongoose.model('Gallery')
const adminauth = mongoose.model('adminauth')
const Notice = mongoose.model('Notice')
const Post  = mongoose.model('Post') 



app.engine('handlebars', exphbs({
	handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main' }))

app.set('view engine', 'handlebars')

app.use(express.static('./views/images'))

app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }))

app.use('/AdminLogin', AdminLogin)
app.use('/contact', contact)

app.get('/', function (req, res) {
  res.render('blogs', {})
})



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

app.get('/notice', async (req, res) => {
  const notice = await Notice.find({})
  res.render('notice', {
    notice
  })
})

app.get('/about', async (req, res) => {
  const about = await Post.find({})
  res.render('about', {
    about
  })
})


app.post('/create_blog', upload.single('image'), async (req, res) => {
  const result = await cloudinary.v2.uploader.upload(req.file.path)
  const blog = new Blog()
  blog.title = req.body.title
  blog.imageUrl = result.secure_url
  blog.image_id = result.public_id
  await blog.save()
  res.redirect('/blogs')
})

app.post('/upload-for-gallery', gallerYupload.single('image'), async (req, res) => {
  const result = await cloudinary.v2.uploader.upload(req.file.path)
  const gal = new Gallery()
  gal.date = req.body.date
  gal.title = req.body.title
  gal.imageUrl = result.secure_url
  gal.image_id = result.public_id
  await gal.save()
  res.redirect('/gallery')
})

app.post('/upload-for-notice', noticeupload.single('image'), async (req, res) => {
  const result = await cloudinary.v2.uploader.upload(req.file.path)
  const not = new Notice()
  not.date = req.body.date
  not.title = req.body.title
  not.imageUrl = result.secure_url
  not.image_id = result.public_id
  await not.save()
  res.redirect('/notice')
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

app.post('/addpost', blogpost.single('image'), async (req, res) => {
  const result = await cloudinary.v2.uploader.upload(req.file.path)
  const post = new Post()
  post.title = req.body.title
  post.date = req.body.date
  post.description = req.body.description
  post.content = req.body.content
  post.imageUrl = result.secure_url
  post.image_id = result.public_id
  await post.save()
  res.redirect('/about')
})


//const port = ||3000
app.listen((process.env.PORT || 5000), () => {
     console.log(`Server is running at ${process.env.PORT}`)
     })
