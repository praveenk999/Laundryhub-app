const colors = require('colors');

console.log(`🧪 Testing LaundryHub Backend Logging System`.blue.bold);
console.log(`==========================================`.blue);

// Test different log levels
console.log(`✅ SUCCESS: This is a success message`.green.bold);
console.log(`❌ ERROR: This is an error message`.red.bold);
console.log(`⚠️  WARNING: This is a warning message`.yellow.bold);
console.log(`ℹ️  INFO: This is an info message`.blue);
console.log(`🔍 DEBUG: This is a debug message`.cyan);

// Test API request simulation
const timestamp = new Date().toISOString();
console.log(`🔄 [${timestamp}] POST /student/createorder - Request received`.white);
console.log(`📤 Request Body:`.blue, JSON.stringify({
  student: 'john_doe',
  launderer: 'wash_master',
  orderTotal: 150,
  items: [
    { item: 'Shirt', washType: 'simple_wash', quantity: 2 }
  ]
}, null, 2));

// Simulate success response
console.log(`✅ [${timestamp}] POST /student/createorder - 201 SUCCESS`.white);
console.log(`📥 Response:`.green, JSON.stringify({
  success: true,
  message: 'Order created successfully',
  orderId: '64abc123def456789'
}, null, 2));

console.log(`==========================================`.blue);
console.log(`🎉 Logging test completed!`.green.bold);
