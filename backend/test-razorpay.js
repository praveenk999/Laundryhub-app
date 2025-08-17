const Razorpay = require('razorpay');
require('dotenv').config();

const testRazorpay = async () => {
  try {
    console.log('🔄 Testing Razorpay integration...');
    
    
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
      throw new Error('Razorpay keys not found in environment variables');
    }
    
    console.log('Key ID:', process.env.RAZORPAY_KEY_ID ? 'Found' : 'Missing');
    console.log('Secret:', process.env.RAZORPAY_SECRET ? 'Found' : 'Missing');
    
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    
    const options = {
      amount: 5000, 
      currency: 'INR',
      receipt: 'test_order_' + Date.now(),
      notes: {
        description: 'LaundryHub Test Order'
      }
    };

    console.log('📋 Creating test order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('✅ Razorpay Order Created:', {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status
    });
    
    
    const fetchedOrder = await razorpay.orders.fetch(order.id);
    console.log('✅ Order Fetched Successfully:', fetchedOrder.id);
    
    
    try {
      const methods = await razorpay.methods.all();
      console.log('✅ Payment methods available:', methods ? 'Yes' : 'No');
    } catch (methodError) {
      console.log('ℹ️  Payment methods check skipped (not critical)');
    }
    
    console.log('✅ Razorpay integration test completed successfully!');
    console.log('🔍 You can now test payments using test cards:');
    console.log('   Card: 4111 1111 1111 1111');
    console.log('   Expiry: Any future date');
    console.log('   CVV: Any 3 digits');
    
  } catch (error) {
    console.error('❌ Razorpay Error:', error.message);
    
    if (error.message.includes('key_id')) {
      console.error('💡 Check your RAZORPAY_KEY_ID in the .env file');
    }
    if (error.message.includes('key_secret')) {
      console.error('💡 Check your RAZORPAY_SECRET in the .env file');
    }
    if (error.message.includes('unauthorized')) {
      console.error('💡 Verify your Razorpay API keys are correct');
    }
    
    process.exit(1);
  }
};

testRazorpay();
