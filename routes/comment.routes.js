const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, commentController.addComment);
router.get('/post/:postId', commentController.getCommentsByPost);

module.exports = router;
