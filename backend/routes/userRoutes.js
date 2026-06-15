const express = require('express');
const {
  authUser,
  registerUser,
  logoutUser,
} = require('../controllers/userController');

const router = express.Router();

router.route('/').post(registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);

module.exports = router;
