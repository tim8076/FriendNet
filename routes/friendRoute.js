const express = require('express');
const router = express.Router();
const {
  getAllFriends,
  addFriend,
  removeFriend,
} = require('../controllers/friendController');
const { authenticateUser } = require('../middleware/authentication');

router.get('/', authenticateUser, getAllFriends);
router.post('/', authenticateUser, addFriend);
router.delete('/', authenticateUser, removeFriend);

module.exports = router;

