const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/orderModel');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const createOrder = async (req, resp) => {
  try {
    console.log(`Creating Razorpay order...`.blue);
    console.log(`Order options:`.cyan, JSON.stringify(req.body, null, 2));
    
    const options = req.body;
    const order = await razorpay.orders.create(options);
    
    if (!order) {
      console.error(`Failed to create Razorpay order`.red);
      return resp.status(401).json({
        message: 'Some error occurred',
      });
    }
    
    console.log(` Razorpay order created successfully:`.green);
    console.log(`Order ID: ${order.id}`.green);
    console.log(`💰 Amount: ₹${order.amount / 100}`.green);
    
    resp.json(order);
  } catch (err) {
    console.error(` Error creating Razorpay order:`.red, err.message);
    console.error(` Error details:`.red, err);
    resp.status(401).json({
      message: err,
    });
  }
};

const validatePayment = async (req, resp) => {
  try {
    console.log(`Validating payment...`.blue);
    console.log(` Payment data:`.cyan, JSON.stringify(req.body, null, 2));
    
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
    } = req.body;
    
    console.log(` Generating signature for validation...`.yellow);
    const sha = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest('hex');

    console.log(` Expected signature: ${digest}`.cyan);
    console.log(`Received signature: ${razorpay_signature}`.cyan);

    if (digest !== razorpay_signature) {
      console.error(` Payment validation failed - Invalid signature`.red);
      return resp.status(401).json({
        message: 'Invalid signature',
      });
    }
    
    console.log(`Payment signature validated successfully`.green);
    console.log(` Updating order ${order_id} as paid...`.blue);
    
    const updatedOrder = await Order.findByIdAndUpdate(order_id, {
      paid: true,
    });
    updatedOrder.save();
    
    console.log(` Order ${order_id} marked as paid successfully`.green.bold);
    
    resp.json({
      message: 'Payment successful',
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (err) {
    console.error(` Error validating payment:`.red, err.message);
    console.error(` Error details:`.red, err);
    resp.status(401).json({
      message: err,
    });
  }
};

module.exports = { createOrder, validatePayment };
