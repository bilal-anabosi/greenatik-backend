const express = require('express');
const router = express.Router();
const { getAllBlogs,getBlogById, getBlogsByCategory, getUserBlogs,createBlog, deleteBlog } = require('../controllers/blogController');
const { authenticateToken, authorizeRoles } = require('../middelware/auth');
const uploadBlog = require('../middelware/uploadBlog');

router.get('/user-blogs', authenticateToken,authorizeRoles(['admin']), getUserBlogs);
router.post('/create-new-blog', authenticateToken, authorizeRoles(['admin']), uploadBlog.single('cover'), createBlog);
router.get('/blogs', getAllBlogs);
router.get('/blogs/:id', getBlogById);
router.get('/category/:category', getBlogsByCategory);
router.delete('/blogs/:id', authenticateToken, authorizeRoles(['admin']), deleteBlog);


module.exports = router;
