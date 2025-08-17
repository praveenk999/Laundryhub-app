import React from 'react';

const ScrollTest = () => {
  const testOrders = Array.from({ length: 50 }, (_, i) => ({
    id: `order_${i + 1}`,
    total: Math.floor(Math.random() * 500) + 100,
    date: `2025-01-${(i % 30) + 1}`,
    items: Math.floor(Math.random() * 10) + 1,
    status: i % 2 === 0 ? 'Accepted' : 'Pending'
  }));

  return (
    <div className="flex flex-col items-start gap-4 ml-32 h-screen overflow-hidden">
      <h1 className="text-4xl font-bold">
        Scroll Test - 50 Orders
      </h1>
      
      <div className="w-[75vw] h-[calc(100vh-200px)] overflow-auto border-2 border-gray-300 rounded-md scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b">
              <th className="p-2 text-left font-semibold">Order ID</th>
              <th className="p-2 text-left font-semibold">Total</th>
              <th className="p-2 text-left font-semibold">Date</th>
              <th className="p-2 text-left font-semibold">Items</th>
              <th className="p-2 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {testOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{order.id}</td>
                <td className="p-2">₹{order.total}</td>
                <td className="p-2">{order.date}</td>
                <td className="p-2">{order.items}</td>
                <td className="p-2">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <p className="text-sm text-gray-500">
        ✅ If you can scroll through all 50 orders, scrolling is working!
      </p>
    </div>
  );
};

export default ScrollTest;
