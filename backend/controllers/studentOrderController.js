const jwt = require('jsonwebtoken');
const Order = require('../models/orderModel');
const User = require('../models/userModel');



const getStudentOrders = async (req, resp) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const studentId = decodedToken.user_id; 
    const result = await Order.find({
      user: studentId,
    });
    resp.status(200).json({
      orders: result,
    });
  } catch (err) {
    console.error(err);
    resp.status(401).json({
      message: 'Unauthorized',
    });
  }
};




const createStudentOrder = async (req, resp) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const studentId = decodedToken.user_id; 
    if (decodedToken.role !== 'student') {
      return resp.status(401).json({
        message: 'User does not have access rights',
      });
    }
    const {
      items,
      deliveryDate,
      deliveryTime,
      pickupAddress,
      deliveryAddress,
      orderTotal,
      pickupDate,
      pickupTime,
      launderer,
    } = req.body;
    
    const result = await User.find({
      username: launderer,
    });
    if (result.length === 0) {
      return resp.status(404).json({
        message: 'Launderer not found',
      });
    }
    const order = new Order({
      user: studentId,
      items,
      deliveryDate,
      deliveryTime,
      pickupAddress,
      deliveryAddress,
      orderTotal,
      pickupDate,
      pickupTime,
      launderer,
    });
    await order.save();
    resp.status(201).json({
      order: order,
    });
  } catch (err) {
    console.error(err);
    resp.status(500).json({
      message: 'Error creating the order',
      error: err,
    });
  }
};




const updatePickupStatus = async (req, resp) => {
  try {
    const orderId = req.params.order_id;
    const order = await Order.findById(orderId);
    if (order === null) {
      return resp.status(404).json({
        message: 'Order not found',
      });
    }
    if (order.acceptedStatus === false) {
      return resp.status(400).json({
        message: 'Order not accepted yet',
      });
    }
    if (order.pickUpStatus === true) {
      return resp.status(400).json({
        message: 'Order already picked up',
      });
    }
    order.pickUpStatus = true;
    order.save();
    resp.status(200).json({
      message: 'Pickup status updated successfully',
      updatedOrder: order,
    });
  } catch (err) {
    console.error(err);
    resp.status(500).json({
      message: 'Error updating the pickup status',
      error: err,
    });
  }
};




const deleteOrder = async (req, resp) => {
  try {
    const orderId = req.params.order_id;

    const result = await Order.findByIdAndDelete(orderId);
    if (!result) {
      return resp.status(404).json({
        message: 'Order not found',
      });
    }

    resp.status(200).json({
      message: 'Order deleted successfully',
      order: result,
    });
  } catch (err) {
    console.error(err);
    resp.status(500).json({
      message: 'Error deleting the order',
      error: err,
    });
  }
};




const updateDeliveryStatus = async (req, resp) => {
  try {
    const orderId = req.params.order_id;
    const order = await Order.findById(orderId);
    if (order.pickUpStatus === false) {
      return resp.status(400).json({
        message: 'Order not picked up yet',
      });
    }
    if (order.acceptedStatus === false) {
      return resp.status(400).json({
        message: 'Order not accepted yet',
      });
    }
    if (order.deliveredStatus === true) {
      return resp.status(400).json({
        message: 'Order already delivered',
      });
    }
    order.deliveredStatus = true;
    order.save();
    resp.status(200).json({
      message: 'Delivery status updated successfully',
      updatedOrder: order,
    });
  } catch (err) {
    console.error(err);
    resp.status(500).json({
      message: 'Error updating the delivery status',
      error: err,
    });
  }
};




const getAllLaunderers = async (req, resp) => {
  try {
    const launderers = await User.find({ role: 'launderer' });
    const laundererDetails = launderers.map((launderer) => {
      return {
        username: launderer.username,
        phone_number: launderer.phone_number,
      };
    });
    resp.status(200).json({
      launderers: laundererDetails,
    });
  } catch (err) {
    resp.status(500).json({
      message: 'Error fetching the launderers',
      error: err,
    });
  }
};

module.exports = {
  getStudentOrders,
  createStudentOrder,
  updatePickupStatus,
  deleteOrder,
  updateDeliveryStatus,
  getAllLaunderers,
};
