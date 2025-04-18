const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');

router.get('/me', auth, userController.getMyProfile);
router.get('/:id', userController.getUserById);
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;
