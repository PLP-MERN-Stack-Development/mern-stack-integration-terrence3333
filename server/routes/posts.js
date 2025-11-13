const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const postsController = require('../controllers/postsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// simple multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', postsController.getAllPosts);
router.get('/search', postsController.getAllPosts); // handled via query q=
router.get('/:id', postsController.getPost);

// protected routes
router.post('/', protect, upload.single('featuredImage'), [
  body('title').notEmpty(),
  body('content').notEmpty(),
  body('category').notEmpty()
], postsController.createPost);

router.put('/:id', protect, upload.single('featuredImage'), postsController.updatePost);
router.delete('/:id', protect, postsController.deletePost);

// comments
router.post('/:id/comments', protect, [ body('content').notEmpty() ], postsController.addComment);

module.exports = router;
