const jwt = require('jsonwebtoken');
const Notification = require('../models/notificationModel');
const Order = require('../models/orderModel');



const getNotifications = async (req, resp) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decodedToken.role === 'student') {
      const notifications = await Notification.find({
        student: decodedToken.username,
      });
      resp.status(200).json({
        notifications: notifications,
        unreadCount: notifications.filter((notification) => !notification.read)
          .length,
      });
    } else {
      const notifications = await Notification.find({
        launderer: decodedToken.username,
      });
      resp.status(200).json({
        notifications: notifications,
        unreadCount: notifications.filter((notification) => !notification.read)
          .length,
      });
    }
  } catch (err) {
    resp.status(500).json('NotificationModel error');
  }
};




const createNotification = async (req, resp) => {
  try {
    const { student, launderer, message, orderId } = req.body;
    const token = req.cookies.jwt;
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    let studentName = '';
    
    if (student === '') {
      const order = await Order.findById(orderId).populate('user', 'username');
      studentName += order.user.username;
    }
    const notification = new Notification({
      user: decodedToken.user_id, 
      student: decodedToken.role === 'student' ? '' : studentName,
      launderer: decodedToken.role === 'launderer' ? '' : launderer,
      message: message,
      read: false, 
    });
    await notification.save();
    resp.status(201).json({
      notification: notification,
    });
  } catch (err) {
    resp.status(500).json({
      error: err.message,
      message: 'Error sending the notification',
    });
  }
};




const deleteNotification = async (req, resp) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      resp.status(404).json({ message: 'Notification not found' });
    }
    resp.status(200).json({ message: 'Notification removed' });
  } catch (err) {
    resp.status(500).json({ message: 'Error removing the notification' });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  deleteNotification,
};
