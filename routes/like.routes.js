const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, likeController.toggleLike);

module.exports = router;
