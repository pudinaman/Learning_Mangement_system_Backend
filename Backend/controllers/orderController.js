const Order = require('../models/orderModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncError');

// Create a new order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const { courses, paymentInfo, billingAddress, paidAt, totalPrice } = req.body;

  const order = await Order.create({
    user: req.user._id,
    courses,
    paymentInfo,
    billingAddress,
    paidAt,
    totalPrice,
    orderStatus: 'processing',
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// Get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return next(new ErrorHandler('Order not found with this id', 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get Logged-in User Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Update Order Status (for example, after payment completion)
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler('Order not found with this id', 404));
  }

  order.orderStatus = status;
  await order.save();

  res.status(200).json({
    success: true,
    order,
  });
});

// Get All Orders (for admin)
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find().populate('user', 'name email');

  res.status(200).json({
    success: true,
    orders,
  });
});
