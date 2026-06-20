const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create order
// @route   POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const { shippingInfo, paymentMethod } = req.body;

    // Get user cart
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Calculate prices
    const itemsPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const taxPrice = Math.round(itemsPrice * 0.1 * 100) / 100; // 10% tax
    const shippingPrice = itemsPrice > 50 ? 0 : 5.99; // Free shipping over $50
    const totalPrice = Math.round((itemsPrice + taxPrice + shippingPrice) * 100) / 100;

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images[0]?.url || '',
      price: item.price,
      quantity: item.quantity,
    }));

    let paymentInfo = { method: paymentMethod };

    // Handle Stripe payment
    if (paymentMethod === 'stripe') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalPrice * 100),
        currency: 'usd',
        metadata: { userId: req.user.id.toString() },
      });
      paymentInfo.stripePaymentId = paymentIntent.id;
      paymentInfo.status = 'pending';
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingInfo,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    // Clear cart after order
    await Cart.findOneAndDelete({ user: req.user.id });

    // Update stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json({
      success: true,
      order,
      clientSecret: paymentMethod === 'stripe' ? (await stripe.paymentIntents.retrieve(paymentInfo.stripePaymentId)).client_secret : null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my orders
// @route   GET /api/orders/my
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    // Ensure user owns the order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
    const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
    res.status(200).json({ success: true, count: orders.length, totalRevenue, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = req.body.orderStatus;
    if (req.body.orderStatus === 'Delivered') {
      order.deliveredAt = Date.now();
      order.paymentInfo.status = 'paid';
    }

    await order.save();
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
