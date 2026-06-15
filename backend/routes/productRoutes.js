const express = require('express');

const router = express.Router();

const products = [
  {
    _id: '1',
    name: 'Elegantna sveca',
    image: '/images/19ac7efe-f1f1-46bc-83b0-d6c1b962e436.jpeg',
    description: 'Rucno izradjena sveca za toplu i elegantnu atmosferu u domu.',
    category: 'Svece',
    price: 450,
    countInStock: 10,
    rating: 5,
    numReviews: 12,
  },
  {
    _id: '2',
    name: 'Mirisna sveca',
    image: '/images/65299604-0734-49b2-9aeb-13c24d84fb2e.jpeg',
    description: 'Nezna mirisna sveca koja prostoru daje luksuzan i prijatan osecaj.',
    category: 'Svece',
    price: 700,
    countInStock: 7,
    rating: 5,
    numReviews: 8,
  },
];

router.get('/', (req, res) => {
  res.json(products);
});

router.get('/:id', (req, res) => {
  const product = products.find((item) => item._id === req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

module.exports = router;
