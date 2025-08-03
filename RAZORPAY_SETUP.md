# Razorpay Setup Guide

## Step 1: Create Razorpay Account

1. Go to https://razorpay.com
2. Click "Sign Up" 
3. Complete business registration
4. Verify email and phone number

## Step 2: Get API Keys

### Test Mode (Development)
1. Login to Razorpay Dashboard
2. Go to "Settings" > "API Keys"
3. Under "Test Mode", click "Generate Test Keys"
4. Copy the Key ID and Key Secret

### Live Mode (Production)
1. Complete KYC verification
2. Go to "Settings" > "API Keys" 
3. Under "Live Mode", click "Generate Live Keys"
4. Copy the Key ID and Key Secret

## Step 3: Configure Environment Variables

### Backend (.env)
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

### Frontend (.env)
```env
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
```

**Important**: 
- Never expose the Key Secret in frontend
- Use test keys for development
- Switch to live keys only for production

## Step 4: Test Payment Integration

### Test Cards (Test Mode Only)

**Successful Payments:**
- Card: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits
- Name: Any name

**Failed Payments:**
- Card: 4000 0000 0000 0002
- Expiry: Any future date  
- CVV: Any 3 digits
- Name: Any name

### Test UPI IDs
- success@razorpay
- failure@razorpay

### Test Netbanking
- Use any test bank from the list
- Select "Success" or "Failure" to simulate

## Step 5: Webhook Configuration (Optional)

1. Go to "Settings" > "Webhooks"
2. Add webhook URL: `https://yourdomain.com/webhook`
3. Select events to listen for:
   - payment.captured
   - payment.failed
   - order.paid

## Sample Integration Test

Create a test file to verify Razorpay integration:

```javascript
// test-razorpay.js
const Razorpay = require('razorpay');
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const testOrder = async () => {
  try {
    const options = {
      amount: 5000, // amount in paise (₹50.00)
      currency: 'INR',
      receipt: 'order_test_' + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    console.log('✅ Razorpay Order Created:', order);
    
    // Test fetching order
    const fetchedOrder = await razorpay.orders.fetch(order.id);
    console.log('✅ Order Fetched:', fetchedOrder.id);
    
  } catch (error) {
    console.error('❌ Razorpay Error:', error);
  }
};

testOrder();
```

Run the test:
```bash
cd backend
node test-razorpay.js
```

## Integration Points in LaundryHub

### 1. Order Creation (Backend)
File: `controllers/razorpayController.js`
- Creates Razorpay order when user initiates payment
- Returns order details to frontend

### 2. Payment Processing (Frontend)  
File: `components/StudentOrdersDetail/index.jsx`
- Opens Razorpay checkout modal
- Handles payment success/failure
- Sends payment details back to backend

### 3. Payment Verification (Backend)
File: `controllers/razorpayController.js`
- Verifies payment signature
- Updates order status in database
- Prevents payment tampering

## Security Best Practices

1. **Never expose Key Secret**: Only use in backend
2. **Verify signatures**: Always verify payment signatures
3. **Use HTTPS**: Ensure secure data transmission
4. **Validate amounts**: Check amounts on server side
5. **Log transactions**: Keep detailed payment logs

## Troubleshooting

### Common Issues

1. **Invalid Key Error**
   - Check if keys are correct
   - Ensure no extra spaces in environment variables
   - Verify test/live mode consistency

2. **Signature Verification Failed**
   - Check if Key Secret matches
   - Ensure proper signature generation
   - Verify webhook payload format

3. **Payment Gateway Not Loading**
   - Check internet connectivity
   - Verify Razorpay script is loaded
   - Check browser console for errors

4. **Order Creation Failed**
   - Verify API keys are active
   - Check amount format (must be in paise)
   - Ensure currency is supported

### Testing Checklist

- [ ] Successful payment flow
- [ ] Failed payment handling
- [ ] Order status updates
- [ ] Database updates after payment
- [ ] Error handling and user feedback
- [ ] Amount calculation accuracy
- [ ] Security signature verification
