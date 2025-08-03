const mongoose = require('mongoose');
// eslint-disable-next-line no-unused-vars
const colors = require('colors');
const Order = require('../models/orderModel');

const connect = async () => {
  try {
    console.log(`🔄 Attempting to connect to MongoDB...`.yellow);
    console.log(
      `📍 MongoDB URI: ${process.env.MONGO_URI?.substring(0, 50)}...`.cyan
    );

    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB connected successfully!`.green.bold);
    console.log(`🏠 Host: ${connection.connection.host}`.cyan.underline);
    console.log(`🗃️  Database: ${connection.connection.name}`.cyan.underline);
    console.log(
      `📊 Connection State: ${connection.connection.readyState}`.cyan
    );
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed!`.red.bold);
    console.error(`🔍 Error Message: ${error.message}`.red.underline);
    console.error(`📚 Error Stack:`.red, error.stack);
    process.exit(1);
  }
};

// db optimization: delete orders that are paid, accepted, delivered and picked up every 2 days
const deleteValidOrders = async () => {
  try {
    const timestamp = new Date().toISOString();
    console.log(
      `🧹 [${timestamp}] Starting scheduled order cleanup...`.blue.bold
    );

    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago

    console.log(
      `📅 Deleting orders older than: ${twoDaysAgo.toISOString()}`.cyan
    );

    const result = await Order.deleteMany({
      paid: true,
      acceptedStatus: true,
      deliveredStatus: true,
      pickUpStatus: true,
      updatedAt: { $lte: twoDaysAgo },
    });

    if (result.deletedCount > 0) {
      console.log(
        `✅ Successfully deleted ${result.deletedCount} completed orders.`.green
          .bold
      );
    } else {
      console.log(`ℹ️  No old orders found to delete.`.yellow);
    }

    console.log(`🏁 Order cleanup completed.`.blue.bold);
  } catch (err) {
    console.error(`❌ Error during order cleanup:`.red.bold);
    console.error(`🔍 Error Message:`.red, err.message);
    console.error(`📚 Error Stack:`.red, err.stack);
  }
};

module.exports = {
  connect,
  deleteValidOrders,
};
