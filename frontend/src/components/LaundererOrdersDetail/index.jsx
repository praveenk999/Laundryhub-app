
import React, { useEffect, useState } from 'react';
import useAuthStore from '../Store/AuthStore';
import {
  getAllOrders,
  postNotif,
  updateAcceptedStatus,
  updateDeliveryStatus,
} from '../../utils/apis';

function LaundererOrdersDetail() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState(['all']);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userName } = useAuthStore((state) => ({
    userName: state.userName,
  }));
  
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  
  const handleToast = (title, description, status) => {
    console.log(`${status}: ${title} - ${description}`);
  };

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await getAllOrders();
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
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return handleToast('Error', 'Please Login again', 'error');
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
              <th className="text-right p-2 border-b">Order ID</th>
              <th className="text-right p-2 border-b">Order Total</th>
              <th className="text-right p-2 border-b">Pickup Date</th>
              <th className="text-right p-2 border-b">Total Items</th>
              <th className="text-right p-2 border-b">Accepted Status</th>
              <th className="text-right p-2 border-b">Delivery Status</th>
              <th className="text-right p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="text-right p-2">{order._id}</td>
                <td className="text-right p-2">₹{order.orderTotal}</td>
                <td className="text-right p-2">{order.pickupDate}</td>
                <td className="text-right p-2">{getTotalQuantity(order.items)}</td>
                <td className="text-right p-2">
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
                <td className="text-right p-2">
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
                <td className="text-right p-2">
                  <div className="flex gap-2 justify-end items-center">
                    <button
                      className="text-[#ce1567] hover:text-[#a0114d] px-2 py-1 rounded"
                      onClick={() => handleCardClick(order)}
                    >
                      View Details
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
              <h3 className="text-xl font-bold">
                Order ID: {selectedOrder._id}
              </h3>
              <hr className="my-2" />
              <h4 className="text-lg font-bold text-purple-500">
                Student Details:
              </h4>
              <hr className="my-2" />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p>
                    <strong>Student Username:</strong>{' '}
                    {selectedOrder.user.username}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Contact No.:</strong>{' '}
                    {selectedOrder.user.phone_number}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Roll No.:</strong> {selectedOrder.user.roll_number}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Hostel:</strong> {selectedOrder.user.hostel}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Room No.:</strong> {selectedOrder.user.room_number}
                  </p>
                </div>
              </div>
              <hr className="my-2" />
              <h4 className="text-lg font-bold text-orange-500">
                Order Details:
              </h4>
              <hr className="my-2" />
              <div className="grid grid-cols-2 gap-2">
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
                  <p>
                    <strong>Accepted Status:</strong>
                  </p>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      selectedOrder.acceptedStatus
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedOrder.acceptedStatus ? 'Accepted' : 'Not Accepted'}
                  </span>
                </div>
                <div>
                  <p>
                    <strong>Delivery Status:</strong>
                  </p>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
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
                  <p>
                    <strong>Pickup Status:</strong>
                  </p>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      selectedOrder.pickUpStatus
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedOrder.pickUpStatus ? 'Picked Up' : 'Not Picked Up'}
                  </span>
                </div>
                <div>
                  <p>
                    <strong>Payment Status:</strong>
                  </p>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
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
              <p className="text-lg">
                <strong>Order Total: </strong>₹{selectedOrder.orderTotal}
              </p>
              <hr className="my-2" />
              <p className="text-lg font-bold">
                Items:
              </p>

              <div className="accordion space-y-2">
                {['simple_wash', 'power_clean', 'dry_clean'].map((washType) => {
                  const itemsByWashType = selectedOrder.items.filter(
                    (item) => item.washType === washType
                  );

                  if (itemsByWashType.length === 0) {
                    return null;
                  }

                  return (
                    <details key={washType} className="border border-gray-200 rounded-lg">
                      <summary className="cursor-pointer p-4 hover:bg-gray-50">
                        <span
                          className={`text-lg font-bold ${
                            washType === 'simple_wash'
                              ? 'text-blue-500'
                              : washType === 'power_clean'
                                ? 'text-orange-500'
                                : 'text-purple-500'
                          }`}
                        >
                          {washType === 'simple_wash'
                            ? 'Simple Wash'
                            : washType === 'power_clean'
                              ? 'Power Clean'
                              : 'Dry Clean'}
                        </span>
                      </summary>
                      <div className="p-4 pt-0">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr>
                              <th className="border border-gray-300 p-2 text-center">Name</th>
                              <th className="border border-gray-300 p-2 text-center">Quantity</th>
                              <th className="border border-gray-300 p-2 text-center">Price per Item</th>
                            </tr>
                          </thead>
                          <tbody>
                            {itemsByWashType.map((item, index) => (
                              <tr key={index}>
                                <td className="border border-gray-300 p-2 text-center">{item.name}</td>
                                <td className="border border-gray-300 p-2 text-center">{item.quantity}</td>
                                <td className="border border-gray-300 p-2 text-center">₹{item.pricePerItem}</td>
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
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition-colors"
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

export default LaundererOrdersDetail;
