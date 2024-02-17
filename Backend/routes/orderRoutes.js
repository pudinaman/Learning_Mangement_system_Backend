const express = require('express');
const router = express.Router();
const { isAuthenticatedUser,authorizedRoles } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

// Create a new order
router.post('/order/new', isAuthenticatedUser, orderController.newOrder);

// Get Single Order
router.get('/order/:id', isAuthenticatedUser, orderController.getSingleOrder);

// Get Logged-in User Orders
router.get('/orders/myorders', isAuthenticatedUser, orderController.myOrders);

// Update Order Status (for example, after payment completion)
router.put('/orders/:id/updatestatus', isAuthenticatedUser, authorizedRoles('admin'), orderController.updateOrderStatus);

// Get All Orders (for admin)
router.get('/orders/all', isAuthenticatedUser, authorizedRoles('admin'), orderController.getAllOrders);

module.exports = router;
