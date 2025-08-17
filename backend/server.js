const express = require('express');

const colors = require('colors');
const cookieParser = require('cookie-parser');

const dotenv = require('dotenv').config();
const cors = require('cors');
const cron = require('node-cron');
const DB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const laundererRoutes = require('./routes/laundererRoutes');
const studentRoutes = require('./routes/studentRoutes');
const razorpayRoutes = require('./routes/razorpayRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();


app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(
    `🔄 [${timestamp}] ${req.method.yellow} ${req.url.cyan} - Request received`
      .white
  );

  
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    console.log(`📤 Request Body:`.blue, JSON.stringify(req.body, null, 2));
  }

  
  const originalJson = res.json;
  res.json = function json(data) {
    const responseTimestamp = new Date().toISOString();
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log(
        `✅ [${responseTimestamp}] ${req.method.yellow} ${req.url.cyan} - ${
          res.statusCode.toString().green
        } SUCCESS`.white
      );
      console.log(`📥 Response:`.green, JSON.stringify(data, null, 2));
    } else if (res.statusCode >= 400) {
      console.log(
        `❌ [${responseTimestamp}] ${req.method.yellow} ${req.url.cyan} - ${
          res.statusCode.toString().red
        } ERROR`.white
      );
      console.log(`📥 Error Response:`.red, JSON.stringify(data, null, 2));
    }
    return originalJson.call(this, data);
  };

  next();
});

const port = process.env.PORT || 4000;
const corsOptions = {
  origin: ['http:
  methods: 'GET, POST, PUT, DELETE, PATCH',
  credentials: true,
  optionsSuccessStatus: 200,
};

DB.connect();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(authRoutes);
app.use(laundererRoutes);
app.use(studentRoutes);
app.use(razorpayRoutes);
app.use(notificationRoutes);



app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`💥 [${timestamp}] UNHANDLED ERROR:`.red.bold);
  console.log(`📍 Route: ${req.method} ${req.originalUrl}`.yellow);
  console.log(`🔍 Error Message:`.red, err.message);
  console.log(`📚 Error Stack:`.red, err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
});


app.use((req, res) => {
  const timestamp = new Date().toISOString();
  console.log(
    `🔍 [${timestamp}] 404 NOT FOUND: ${req.method} ${req.originalUrl}`.yellow
  );
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.get('/', (req, resp) => {
  resp.status(200).json('This is the LaundryHub backend API.');
});

app.listen(port, () => {
  console.log(`🚀 LaundryHub Backend Server Started!`.green.bold);
  console.log(`🌐 Server running on: http:
  console.log(`📅 Environment: ${process.env.NODE_ENV}`.cyan);
  console.log(`🕐 Started at: ${new Date().toISOString()}`.cyan);
  console.log(`⏰ Cron job scheduled: Daily cleanup at midnight`.blue);
});



cron.schedule('0 0 * * *', () => {
  console.log(`⏰ Cron job triggered: Starting daily order cleanup`.blue.bold);
  DB.deleteValidOrders();
});
