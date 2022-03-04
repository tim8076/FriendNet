const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');

const {
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserPassword,
  showCurrentUser,
} = require('../controllers/userController');

router.get('/', authenticateUser,  getAllUsers);
router.get('/showMe', authenticateUser, showCurrentUser);
router.get('/:id', authenticateUser, getSingleUser);
router.patch('/updateUser/:id', authenticateUser,  updateUser);
router.patch('/updateUserPassword/:id', authenticateUser, updateUserPassword);

module.exports = router;