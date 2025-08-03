const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('Connection URI:', process.env.MONGO_URI ? 'Found' : 'Missing');
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully!');
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({ 
      name: String, 
      createdAt: { type: Date, default: Date.now }
    });
    const TestModel = mongoose.model('Test', testSchema);
    
    const doc = new TestModel({ name: 'LaundryHub Connection Test' });
    await doc.save();
    console.log('✅ Test document created successfully!');
    
    // Verify document exists
    const found = await TestModel.findOne({ name: 'LaundryHub Connection Test' });
    console.log('✅ Test document found:', found.name);
    
    // Clean up
    await TestModel.deleteOne({ name: 'LaundryHub Connection Test' });
    console.log('✅ Test document deleted successfully!');
    
    // Test collections that will be used
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Available collections:', collections.map(c => c.name));
    
    await mongoose.connection.close();
    console.log('✅ Database connection test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    if (error.message.includes('authentication failed')) {
      console.error('💡 Check your username and password in the connection string');
    }
    if (error.message.includes('ENOTFOUND')) {
      console.error('💡 Check your network connection and MongoDB server status');
    }
    process.exit(1);
  }
};

testConnection();
