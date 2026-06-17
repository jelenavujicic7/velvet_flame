const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

const wishlistFields = ['name', 'image', 'price', 'countInStock', 'category', 'description', 'rating', 'numReviews'];

const userData = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
});

const pickWishlistData = (item) =>
  wishlistFields.reduce((data, field) => ({ ...data, [field]: item[field] }), {});

const wishlistData = (item) => ({
  _id: item.product,
  ...pickWishlistData(item),
});

const findUser = async (id, res, query = User.findById(id)) => {
  const user = await query;
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  return user;
};

const sendUser = (res, user, status = 200) => res.status(status).json(userData(user));
const sendWishlist = (res, user) => res.status(200).json(user.wishlistItems.map(wishlistData));

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  generateToken(res, user._id);
  sendUser(res, user);
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (await User.findOne({ email })) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });
  generateToken(res, user._id);
  sendUser(res, user, 201);
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('jwt', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
});

const getUserProfile = asyncHandler(async (req, res) => {
  sendUser(res, await findUser(req.user._id, res));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await findUser(req.user._id, res);
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) user.password = req.body.password;
  sendUser(res, await user.save());
});

const getUsers = asyncHandler(async (req, res) => {
  res.json(await User.find({}).select('-password'));
});

const getUserById = asyncHandler(async (req, res) => {
  const query = User.findById(req.params.id).select('-password');
  res.json(await findUser(req.params.id, res, query));
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await findUser(req.params.id, res);
  if (user.isAdmin) {
    res.status(400);
    throw new Error('Cannot delete admin user');
  }

  await User.deleteOne({ _id: user._id });
  res.json({ message: 'User removed' });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await findUser(req.params.id, res);
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.isAdmin = Boolean(req.body.isAdmin);
  sendUser(res, await user.save());
});

const getWishlist = asyncHandler(async (req, res) => {
  sendWishlist(res, await findUser(req.user._id, res));
});

const addWishlistItem = asyncHandler(async (req, res) => {
  const user = await findUser(req.user._id, res);
  const exists = user.wishlistItems.some((item) => item.product.toString() === req.body._id);

  if (!exists) {
    user.wishlistItems.push({ product: req.body._id, ...pickWishlistData(req.body) });
    await user.save();
  }

  sendWishlist(res, user);
});

const removeWishlistItem = asyncHandler(async (req, res) => {
  const user = await findUser(req.user._id, res);
  user.wishlistItems = user.wishlistItems.filter((item) => item.product.toString() !== req.params.id);
  await user.save();
  sendWishlist(res, user);
});

module.exports = {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
};
