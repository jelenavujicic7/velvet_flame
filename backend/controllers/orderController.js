const asyncHandler = require('../middleware/asyncHandler');
const Order = require('../models/orderModel');

const getOrderOrFail = async (id, res) => {
  const order = await Order.findById(id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  return order;
};

const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('Nema porudzbina');
  }

  const order = await Order.create({
    orderItems: orderItems.map((item) => ({
      ...item,
      product: item._id,
      _id: undefined,
    })),
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  res.status(201).json(order);
});

const getMyOrders = asyncHandler(async (req, res) => {
  res.status(200).json(await Order.find({ user: req.user._id }));
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await getOrderOrFail(req.params.id, res);
  const isOwner = order.user._id.toString() === req.user._id.toString();

  if (!isOwner && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized to view this order');
  }

  res.status(200).json(order);
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized to update this order');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer?.email_address,
  };

  res.status(200).json(await order.save());
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await getOrderOrFail(req.params.id, res);
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  res.status(200).json(await order.save());
});

const getOrders = asyncHandler(async (req, res) => {
  res.status(200).json(await Order.find({}).populate('user', 'id name'));
});

module.exports = {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
