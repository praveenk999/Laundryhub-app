import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { IoClose, IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../Store/AuthStore';
import {
  deleteOrder,
  getStudentOrders,
  makePayment,
  postNotif,
  updatePickupStatus,
} from '../../utils/apis';

const dev_env = import.meta.env.VITE_DEV_ENV;

function OrderDetail() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState(['all']);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { userName, userHostel } = useAuthStore((state) => ({
    userName: state.userName,
    userHostel: state.userHostel,
  }));

  const handleToast = (title, description) => {
    alert(`${title}: ${description}`);
  };

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await getStudentOrders();
        setOrders(response.data.orders);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  const handleCardClick = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  const getTotalQuantity = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const handleFilterChange = (value) => {
    if (value === 'all') {
      setSelectedFilters(['all']);
    } else {
      setSelectedFilters((prev) => {
        const newFilters = prev.includes(value)
          ? prev.filter((f) => f !== value)
          : [...prev.filter((f) => f !== 'all'), value];
        return newFilters.length === 0 ? ['all'] : newFilters;
      });
    }
  };

  const handlePayment = async (order) => {
    try {
      console.log('💳 Starting payment process...');
      console.log('🔍 Razorpay Key ID:', import.meta.env.VITE_RAZORPAY_KEY_ID);
      console.log('📦 Order details:', order);
      
      const receipt = Math.random().toString(36).substring(7);
      const body = { amount: order.orderTotal * 100, currency: 'INR', receipt };
      
      console.log('📤 Sending payment request:', body);
      
      const response = await makePayment(body);
      const orderDetails = await response.data;
      
      console.log('✅ Payment order created:', orderDetails);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderDetails.amount,
        currency: 'INR',
        name: 'LaundryHub',
        description: 'Order Payment',
        image: 'http:
        order_id: orderDetails.id,
        async handler(resp) {
          try {
            let validatePayment;
            if (dev_env === 'development') {
              validatePayment = await axios.put(
                'http:
                { ...resp, order_id: order._id }
              );
            } else if (dev_env === 'production') {
              validatePayment = await axios.put(
                'https:
                { ...resp, order_id: order._id }
              );
            }
            const validateResponse = await validatePayment.data;
            const notification = {
              student: userName,
              launderer: order.launderer,
              message: `Order Total of order ${order._id} of ${userName} paid successfully.`,
              orderId: '',
            };
            const notifResponse = await postNotif(notification);
            if (notifResponse.status !== 500) {
              console.log(notifResponse);
            }
            handleToast(
              'Payment Successfully Done and Verified',
              '',
              'success'
            );

            setOrders((prevOrders) =>
              prevOrders.map((prevOrder) => {
                if (prevOrder._id === order._id) {
                  return { ...prevOrder, paid: true };
                }
                return prevOrder;
              })
            );
          } catch (err) {
            handleToast('Payment Validation Failed', err.message, 'error');
          }
        },
        notes: {
          address: 'IIIT Jabalpur',
        },
        theme: {
          color: '#584BAC',
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (result) {
        alert(result.error.code);
        alert(result.error.description);
        alert(result.error.source);
        alert(result.error.step);
        alert(result.error.reason);
        alert(result.error.metadata.order_id);
        alert(result.error.metadata.payment_id);
      });
      
      console.log('🎯 Opening Razorpay checkout...');
      rzp1.open();
    } catch (err) {
      console.error('❌ Payment failed:', err);
      console.error('🔍 Error details:', err.message);
      console.error('📚 Full error:', err);
      handleToast('Payment Failed', err.message, 'error');
    }
  };

  const handleUpdatePickupStatus = async (order_id) => {
    try {
      const response = await updatePickupStatus(order_id);
      if (response.status === 200) {
        const notification = {
          student: userName,
          launderer: selectedOrder.launderer,
          message: `Order ${order_id} of ${userName} of ${userHostel} picked up successfully.`,
          orderId: '',
        };
        const notifResponse = await postNotif(notification);
        if (notifResponse.status !== 500) {
          console.log(notifResponse);
        }
        setOrders((prevOrders) => {
          return prevOrders.map((order) => {
            if (order._id === order_id) {
              return { ...order, pickUpStatus: true };
            }
            return order;
          });
        });
        onClose();
      }
    } catch (err) {
      handleToast('Error Updating Pickup Status', err.message, 'error');
    }
  };

  const handleDeleteOrder = async (order_id) => {
    try {
      const response = await deleteOrder(order_id);
      if (response.status === 200) {
        handleToast('Order Deleted Successfully', '', 'success');
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== order_id)
        );
      }
    } catch (err) {
      handleToast(
        'Error Deleting Order',
        err.message || err.error.message,
        'error'
      );
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (selectedFilters.includes('all')) return true;

    return selectedFilters.every((value) => {
      if (value === 'accepted') return order.acceptedStatus;
      if (value === 'pickedUp') return order.pickUpStatus;
      if (value === 'delivered') return order.deliveredStatus;
      if (value === 'paid') return order.paid;
      return true;
    });
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#ce1567]"></div>
      </div>
    );
  }

  if (error) {
    handleToast('Error', 'Please login again');
    navigate('/login');
    return null;
  }

  return (
    <div className="flex flex-col items-start gap-14 ml-32 h-screen overflow-hidden">
      <h2 className="text-3xl font-bold">
        Order Details:
      </h2>
      <div>
        <div
          className="flex gap-8 overflow-x-scroll"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedFilters.includes('all')}
              onChange={() => handleFilterChange('all')}
              className="form-checkbox h-4 w-4 text-[#ce1567]"
            />
            <span>All</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedFilters.includes('accepted')}
              onChange={() => handleFilterChange('accepted')}
              className="form-checkbox h-4 w-4 text-[#ce1567]"
            />
            <span>Accepted</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedFilters.includes('pickedUp')}
              onChange={() => handleFilterChange('pickedUp')}
              className="form-checkbox h-4 w-4 text-[#ce1567]"
            />
            <span>Picked Up</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedFilters.includes('delivered')}
              onChange={() => handleFilterChange('delivered')}
              className="form-checkbox h-4 w-4 text-[#ce1567]"
            />
            <span>Delivered</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedFilters.includes('paid')}
              onChange={() => handleFilterChange('paid')}
              className="form-checkbox h-4 w-4 text-[#ce1567]"
            />
            <span>Paid</span>
          </label>
        </div>
      </div>
      <div
        className="w-[75vw] h-[calc(100vh-300px)] overflow-auto"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#888 #f1f1f1',
        }}
      >
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              <th className="text-center p-2 border-b">Order ID</th>
              <th className="text-center p-2 border-b">Order Total</th>
              <th className="text-center p-2 border-b">Pickup Date</th>
              <th className="text-center p-2 border-b">Total Items</th>
              <th className="text-center p-2 border-b">Accepted Status</th>
              <th className="text-center p-2 border-b">Delivery Status</th>
              <th className="text-center p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="text-center p-2">{order._id}</td>
                <td className="text-center p-2">₹{order.orderTotal}</td>
                <td className="text-center p-2">{order.pickupDate}</td>
                <td className="text-center p-2">{getTotalQuantity(order.items)}</td>
                <td className="text-center p-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.acceptedStatus
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.acceptedStatus ? 'Accepted' : 'Not Accepted'}
                  </span>
                </td>
                <td className="text-center p-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.deliveredStatus
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.deliveredStatus ? 'Delivered' : 'Not Delivered'}
                  </span>
                </td>
                <td className="text-center p-2">
                  <div className="flex gap-2 justify-center items-center">
                    <button
                      className="text-[#ce1567] hover:text-[#a0114d] px-2 py-1 rounded"
                      onClick={() => handleCardClick(order)}
                    >
                      View Details
                    </button>
                    <button
                      className={`px-3 py-1 rounded text-white ${
                        order.paid || !order.acceptedStatus || !order.pickUpStatus
                          ? 'bg-gray-400 cursor-not-allowed hidden'
                          : 'bg-green-500 hover:bg-green-600'
                      }`}
                      disabled={order.paid || !order.acceptedStatus || !order.pickUpStatus}
                      style={{
                        display: !order.acceptedStatus || !order.pickUpStatus ? 'none' : 'block'
                      }}
                      onClick={() => handlePayment(order)}
                    >
                      Pay
                    </button>
                    <button
                      className={`p-2 rounded text-white ${
                        order.acceptedStatus && (!order.paid || !order.deliveredStatus)
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-red-500 hover:bg-red-600'
                      }`}
                      disabled={
                        order.acceptedStatus &&
                        (!order.paid || !order.deliveredStatus)
                      }
                      onClick={() => handleDeleteOrder(order._id)}
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border-2 border-[#ce1567] w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Order Details</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">
                Order ID: {selectedOrder._id}
              </h3>
              <hr className="my-2" />
              <p className="text-xl font-bold mb-2">
                <strong>Order Total:</strong> ₹{selectedOrder.orderTotal}
              </p>
              <hr className="my-2" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Pickup Address:</strong>{' '}
                    {selectedOrder.pickupAddress}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Delivery Address:</strong>{' '}
                    {selectedOrder.deliveryAddress}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Pickup Date:</strong> {selectedOrder.pickupDate}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Pickup Time:</strong> {selectedOrder.pickupTime}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Delivery Date:</strong> {selectedOrder.deliveryDate}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Delivery Time:</strong> {selectedOrder.deliveryTime}
                  </p>
                </div>
              </div>
              <hr className="my-2" />
              <div className="grid grid-cols-2 gap-4 my-4">
                <div>
                  <p><strong>Accepted Status:</strong></p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedOrder.acceptedStatus
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedOrder.acceptedStatus ? 'Accepted' : 'Not Accepted'}
                  </span>
                </div>
                <div>
                  <p><strong>Delivery Status:</strong></p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedOrder.deliveredStatus
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedOrder.deliveredStatus
                      ? 'Delivered'
                      : 'Not Delivered'}
                  </span>
                </div>
                <div>
                  <p><strong>Pickup Status:</strong></p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedOrder.pickUpStatus
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedOrder.pickUpStatus ? 'Picked Up' : 'Not Picked Up'}
                  </span>
                  {!selectedOrder.acceptedStatus || selectedOrder.pickUpStatus ? null : (
                    <label className="inline-flex items-center ml-2">
                      <input
                        type="checkbox"
                        className="sr-only"
                        onChange={() => handleUpdatePickupStatus(selectedOrder._id)}
                      />
                      <div className="relative">
                        <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                        <div className="absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition-transform duration-300 ease-in-out"></div>
                      </div>
                    </label>
                  )}
                </div>
                <div>
                  <p><strong>Payment Status:</strong></p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedOrder.paid
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedOrder.paid ? 'Paid' : 'Pending'}
                  </span>
                </div>
              </div>
              <hr className="my-2" />
              <h4 className="text-xl font-bold mb-2">Items</h4>
              <div className="space-y-4">
                {['simple_wash', 'power_clean', 'dry_clean'].map((washType) => {
                  const itemsByWashType = selectedOrder.items.filter(
                    (item) => item.washType === washType
                  );

                  if (itemsByWashType.length === 0) {
                    return null;
                  }

                  return (
                    <details key={washType} className="border rounded-lg">
                      <summary className={`cursor-pointer p-3 text-lg font-bold ${
                        washType === 'simple_wash'
                          ? 'text-blue-500'
                          : washType === 'power_clean'
                            ? 'text-orange-500'
                            : 'text-purple-500'
                      }`}>
                        {washType === 'simple_wash'
                          ? 'Simple Wash'
                          : washType === 'power_clean'
                            ? 'Power Clean'
                            : 'Dry Clean'}
                      </summary>
                      <div className="p-4">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr>
                              <th className="text-center p-2 border-b">Name</th>
                              <th className="text-center p-2 border-b">Quantity</th>
                              <th className="text-center p-2 border-b">Price per Item</th>
                            </tr>
                          </thead>
                          <tbody>
                            {itemsByWashType.map((item, index) => (
                              <tr key={index}>
                                <td className="text-center p-2">{item.name}</td>
                                <td className="text-center p-2">{item.quantity}</td>
                                <td className="text-center p-2">₹{item.pricePerItem}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </details>
                  );
                })}
              </div>
              <hr className="my-2" />
            </div>
            <div className="flex justify-end p-6 border-t">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-3"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderDetail;
