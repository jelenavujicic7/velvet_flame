const asyncHandler = require('../middleware/asyncHandler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const getProductOrFail = async (id, res) => {
  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  return product;
};

const setProductFields = (product, body) => {
  const fields = ['name', 'price', 'description', 'image', 'category', 'countInStock'];
  fields.forEach((field) => {
    if (body[field] !== undefined && body[field] !== '') {
      product[field] = body[field];
    }
  });
};

const getProducts = asyncHandler(async (req, res) => {
  res.json(await Product.find({}));
});

const getProductById = asyncHandler(async (req, res) => {
  res.json(await getProductOrFail(req.params.id, res));
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, countInStock } = req.body || {};

  if (!name || !price || !description || !image || !category) {
    res.status(400);
    throw new Error('Popunite sva obavezna polja za proizvod');
  }

  const product = await Product.create({
    name,
    price,
    description,
    image,
    category,
    countInStock: countInStock ?? 0,
    user: req.user._id,
    numReviews: 0,
  });

  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await getProductOrFail(req.params.id, res);
  setProductFields(product, req.body);
  res.status(200).json(await product.save());
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await getProductOrFail(req.params.id, res);
  await Product.deleteOne({ _id: product._id });
  res.status(200).json({ message: 'Product removed' });
});

const createProductReview = asyncHandler(async (req, res) => {
  const { rating } = req.body || {};
  const product = await getProductOrFail(req.params.id, res);

  const bought = await Order.findOne({
    user: req.user._id,
    'orderItems.product': req.params.id,
  });

  if (!bought) {
    res.status(400);
    throw new Error('Samo kupci mogu da ocene ovaj proizvod');
  }

  if (product.reviews.some((review) => review.user.toString() === req.user._id.toString())) {
    res.status(400);
    throw new Error('Vec ste ocenili ovaj proizvod');
  }

  if (!rating) {
    res.status(400);
    throw new Error('Izaberite ocenu');
  }

  product.reviews.push({
    name: req.user.name,
    rating: Number(rating),
    comment: '',
    user: req.user._id,
  });
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => acc + item.rating, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Recenzija je dodata' });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};
