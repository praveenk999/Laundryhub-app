import React, { useState } from 'react';
import { LuIndianRupee } from 'react-icons/lu';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import useOrderStore from '../Store/OrderStore';

function OrderItemsAccordion() {
  const { order, clearItems } = useOrderStore();
  const [expandedItems, setExpandedItems] = useState({});

  const showToast = (message) => {
    alert(message); 
  };

  const handleClear = () => {
    clearItems();
    showToast('Items have been removed from the order.');
  };

  const toggleAccordion = (washType) => {
    setExpandedItems((prev) => ({
      ...prev,
      [washType]: !prev[washType],
    }));
  };

  const segregateItemsByWashType = () => {
    return order.items.reduce((acc, item) => {
      if (!acc[item.washType]) {
        acc[item.washType] = [];
      }
      acc[item.washType].push(item);
      return acc;
    }, {});
  };
  const segregateItems = segregateItemsByWashType();

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="font-semibold text-2xl">
        Items Added
      </h2>
      <div className="px-4 lg:px-8 py-4 rounded-2xl w-80 lg:w-96 border-2 border-gray-400 shadow-lg">
        <div className="space-y-5">
          {Object.keys(segregateItems).map((washType) => (
            <div key={washType} className="border-none my-5">
              <button
                onClick={() => toggleAccordion(washType)}
                className={`w-full flex justify-between items-center text-[#584BAC] text-lg font-semibold rounded-3xl px-3 py-2 transition-colors ${
                  expandedItems[washType] ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                <span>
                  {washType
                    .split('_')
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(' ')}
                </span>
                {expandedItems[washType] ? (
                  <IoChevronUp className="w-5 h-5" />
                ) : (
                  <IoChevronDown className="w-5 h-5" />
                )}
              </button>
              {expandedItems[washType] && (
                <div className="mt-2 px-3">
                  {segregateItems[washType].map((item, index) => (
                    <div key={index} className="flex justify-between items-center mb-1">
                      <span>
                        <span className="font-semibold">
                          {item.quantity}x
                        </span>{' '}
                        {item.name}
                      </span>
                      <div className="flex items-center gap-0">
                        <LuIndianRupee className="text-[#CE1567]" />
                        <span className="text-[#CE1567] font-semibold">
                          {item.quantity * item.pricePerItem}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center font-semibold text-lg mt-4">
          <span>Total:</span>
          <div className="flex items-center gap-0">
            <LuIndianRupee className="text-[#CE1567]" />
            <span className="text-[#CE1567]">{order.orderTotal}</span>
          </div>
        </div>
      </div>
      <button
        className="text-white bg-[#CE1567] hover:bg-[#bf0055] px-6 py-2 rounded transition-colors"
        onClick={handleClear}
      >
        Clear Items
      </button>
    </div>
  );
}

export default OrderItemsAccordion;
