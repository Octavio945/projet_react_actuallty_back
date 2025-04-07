const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:postId/comments', auth, postController.getCommentsForPost);
router.post('/:postId/like', auth, postController.likePost);
router.delete('/:id', auth, postController.deletePost);

module.exports = router;
