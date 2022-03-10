const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getSinglePost,
  createPost,
  deleteSinglePost,
  updateSinglePost,
  likePost,
} = require('../controllers/postController');
const { authenticateUser } = require('../middleware/authentication');

router.get('/', authenticateUser , getAllPosts);
router.get('/:id', authenticateUser , getSinglePost);
router.post('/', authenticateUser , createPost);
router.delete('/:id', authenticateUser , deleteSinglePost);
router.patch('/likes/:id', authenticateUser, likePost);
router.patch('/:id', authenticateUser, updateSinglePost);

module.exports = router;
