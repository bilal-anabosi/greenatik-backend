// middlewares/uploadBlog.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/blogs/'); // Separate folder for blog images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const uploadBlog = multer({ storage: storage });

module.exports = uploadBlog;
