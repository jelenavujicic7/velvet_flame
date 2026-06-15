const express = require('express');

const router = express.Router();

router.post('/login', (req, res) => {
  const { email } = req.body;

  res.json({
    _id: 'local-user',
    name: 'Velvet Flame User',
    email,
    isAdmin: false,
  });
});

router.post('/', (req, res) => {
  const { name, email } = req.body;

  res.status(201).json({
    _id: Date.now().toString(),
    name,
    email,
    isAdmin: false,
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
