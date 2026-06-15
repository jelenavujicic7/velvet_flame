const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
  res.status(201).json({
    _id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
  });
});

module.exports = router;
