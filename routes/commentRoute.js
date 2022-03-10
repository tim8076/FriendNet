const express = require('express');
const router = express.Router();
const {
  createComment,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');
const { authenticateUser } = require('../middleware/authentication');

router.post('/', authenticateUser, createComment);
router.patch('/:id', authenticateUser, updateComment);
router.delete('/:id', authenticateUser, deleteComment);

module.exports = router;