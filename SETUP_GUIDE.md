# LaundryHub Complete Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Razorpay account (for payments)

### Option 1: Automated Setup (Windows)
1. Double-click `setup.bat` to install all dependencies
2. Double-click `start.bat` to run the application

### Option 2: Manual Setup

#### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

#### 2. MongoDB Setup

**Option A: Local MongoDB**
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/laundryhub`

**Option B: MongoDB Atlas (Recommended)**
1. Create account at https://cloud.mongodb.com
2. Create a new cluster
3. Get connection string from "Connect" > "Connect your application"
4. Replace `<password>` and `<dbname>` in the connection string

#### 3. Environment Configuration

**Backend (.env file in backend folder):**
```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/laundryhub
# OR for Atlas: mongodb+srv://username:password@cluster.mongodb.net/laundryhub

# JWT Secret (generate a strong random string)
ACCESS_TOKEN_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_complex_123456789

# Razorpay (get from razorpay.com dashboard)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_SECRET=xxxxxxxxxxxxxxxxxx

# Server
PORT=4000
NODE_ENV=development
```

**Frontend (.env file in frontend folder):**
```env
VITE_DEV_ENV=development
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx

# EmailJS (optional - for contact form)
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

#### 4. Razorpay Setup
1. Go to https://razorpay.com and create an account
2. Navigate to Dashboard > API Keys
3. Generate Test Keys for development
4. Copy Key ID and Key Secret to your .env files

#### 5. EmailJS Setup (Optional)
1. Go to https://www.emailjs.com
2. Create account and service
3. Get Service ID, Template ID, and Public Key
4. Add to frontend .env file

### 🏃‍♂️ Running the Application

#### Development Mode

**Terminal 1 (Backend):**
```bash
cd backend
npm run server
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

#### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

### 🌐 Access URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **MongoDB**: mongodb://localhost:27017 (if local)

## 📋 Features

### For Students
- ✅ User registration and authentication
- ✅ Browse laundry services (Wash & Iron, PowerClean, DryClean)
- ✅ Add clothing items to cart
- ✅ Schedule pickup (date, time, location, launderer)
- ✅ Secure payments via Razorpay
- ✅ Track order status
- ✅ View order history
- ✅ Receive notifications

### For Launderers
- ✅ View assigned orders
- ✅ Update order status (accepted, picked up, delivered)
- ✅ Manage order workflow
- ✅ Receive payment notifications

### System Features
- ✅ JWT-based authentication
- ✅ Real-time notifications
- ✅ Automated order cleanup (every 2 days)
- ✅ Responsive design
- ✅ Payment integration
- ✅ Email notifications

## 🛠️ Tech Stack

### Backend
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Payments**: Razorpay
- **Scheduling**: node-cron
- **Email**: Nodemailer
- **Security**: bcrypt, cors

### Frontend
- **Framework**: React 18 with Vite
- **UI Library**: Chakra UI
- **Animations**: Framer Motion, Lottie React
- **HTTP Client**: Axios
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Styling**: Styled Components

### DevOps
- **Containerization**: Docker
- **Deployment**: Vercel
- **Build Tools**: Vite, ESLint, Prettier

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 4000
   npx kill-port 4000
   # Or change PORT in backend/.env
   ```

2. **MongoDB connection failed**
   - Check if MongoDB service is running
   - Verify connection string in MONGO_URI
   - Check network access for Atlas

3. **Payment not working**
   - Verify Razorpay keys are correct
   - Check if keys match between backend and frontend
   - Ensure test mode is enabled

4. **Dependencies issues**
   ```bash
   # Clear npm cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

### Environment Variables Check
```bash
# Backend
node -e "console.log(process.env.MONGO_URI ? '✅ MONGO_URI set' : '❌ MONGO_URI missing')"

# Frontend
npm run dev # Check console for environment variables
```

## 📚 API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /login` - User login
- `GET /logout` - User logout
- `PATCH /user` - Update user details

### Orders (Students)
- `GET /student/orders` - Get student orders
- `POST /student/createorder` - Create new order

### Orders (Launderers)
- `GET /launderer/orders` - Get launderer orders
- `PUT /launderer/orders/:id/accept` - Accept order
- `PUT /launderer/orders/:id/pickup` - Mark as picked up
- `PUT /launderer/orders/:id/deliver` - Mark as delivered

### Payments
- `POST /payment` - Create Razorpay order
- `PUT /payment/validate` - Validate payment

### Notifications
- `GET /notifications` - Get notifications
- `POST /notifications` - Create notification
- `DELETE /notifications/:id` - Delete notification

## 🚀 Deployment

### Docker Deployment
```bash
# Development
make docker-dev
make run

# Production
make docker-prod
make run
```

### Vercel Deployment
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

## 📄 License
This project is licensed under the ISC License.

## 🤝 Contributing
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support
For issues and questions, please open an issue on the GitHub repository.
