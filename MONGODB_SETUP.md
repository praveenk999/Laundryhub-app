# MongoDB Setup Instructions

## Option 1: Local MongoDB Installation

### Windows
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. Install as a Windows Service (recommended)
4. MongoDB Compass will be included (GUI tool)

### Start MongoDB Service
```powershell
# Start MongoDB service
net start MongoDB

# Stop MongoDB service  
net stop MongoDB
```

### Verify Installation
```powershell
# Connect to MongoDB
mongo

# Or with newer versions
mongosh
```

## Option 2: MongoDB Atlas (Cloud - Recommended)

### Step 1: Create Account
1. Go to https://cloud.mongodb.com
2. Sign up for free account
3. Create new project

### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose "FREE" shared cluster
3. Select cloud provider and region
4. Name your cluster (e.g., "laundryhub-cluster")

### Step 3: Create Database User
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and strong password
5. Set role to "Read and write to any database"

### Step 4: Configure Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add specific IP addresses

### Step 5: Get Connection String
1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with "laundryhub"

Example connection string:
```
mongodb+srv://username:password@laundryhub-cluster.xxxxx.mongodb.net/laundryhub?retryWrites=true&w=majority
```

## Database Collections

LaundryHub uses these collections:
- `users` - Student and launderer accounts
- `orders` - Laundry orders
- `notifications` - System notifications

## Sample Data

### Users Collection
```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "phone": "1234567890",
  "userType": "student", // or "launderer"
  "hostel": "A Block",
  "room": "101",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Orders Collection
```json
{
  "_id": "ObjectId",
  "studentId": "ObjectId",
  "laundererId": "ObjectId",
  "items": [
    {
      "name": "T-shirt",
      "quantity": 2,
      "service": "wash_iron",
      "price": 20
    }
  ],
  "totalAmount": 20,
  "pickupDate": "Date",
  "pickupTime": "10:00 AM",
  "location": "A Block",
  "status": "pending", // pending, accepted, picked_up, delivered
  "paid": false,
  "acceptedStatus": false,
  "pickUpStatus": false,
  "deliveredStatus": false,
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Testing Database Connection

Create a test file to verify your MongoDB connection:

```javascript
// test-db.js
const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully!');
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({ name: String });
    const TestModel = mongoose.model('Test', testSchema);
    
    const doc = new TestModel({ name: 'LaundryHub Test' });
    await doc.save();
    console.log('✅ Test document created successfully!');
    
    await TestModel.deleteOne({ name: 'LaundryHub Test' });
    console.log('✅ Test document deleted successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();
```

Run the test:
```bash
cd backend
node test-db.js
```
