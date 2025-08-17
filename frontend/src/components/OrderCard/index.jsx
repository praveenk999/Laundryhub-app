import React, { useRef } from 'react';
import { HiArrowLongRight, HiMiniCurrencyRupee } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import prices from '../../TempData/prices.json';
import OrderItemsAccordion from '../OrderItemsAccordion';
import useOrderStore from '../Store/OrderStore';

function OrderCard() {
  const { order, updateItems } = useOrderStore((state) => ({
    order: state.order,
    updateItems: state.updateItems,
  }));
  const quantityRefs = useRef(prices.map(() => 0));
  const washTypeRefs = useRef(prices.map(() => ''));
  const navigate = useNavigate();

  const handleToast = (title, description) => {
    alert(`${title}: ${description}`);
  };
  
  const handleCheckout = () => {
    if (order.items.length === 0) {
      handleToast(
        'Please add items before proceeding to checkout',
        '',
        'error'
      );
    } else {
      navigate('/CheckoutPage');
    }
  };
  const handleAddItems = () => {
    const newItems = [];
    prices.forEach((item, index) => {
      const quantity = quantityRefs.current[index];
      const washType = washTypeRefs.current[index];

      if (quantity > 0 && washType) {
        const pricePerItem = item.prices[washType] || 0;
        newItems.push({
          name: item.name,
          quantity,
          washType,
          pricePerItem,
        });
      }
    });
    if (newItems.length > 0) {
      updateItems(newItems);
      handleToast('Items added in the order.', '', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      handleToast(
        'Please fill quantity and wash type before adding any item.',
        '',
        'error'
      );
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <h2 className="mt-24 font-semibold text-3xl">
          Select & Add Items
        </h2>
      </div>
      <div
        className="flex flex-col 2xl:flex-row gap-12 2xl:gap-20 
                   mt-8 pb-20 2xl:pb-0 justify-center items-center"
      >
        <OrderItemsAccordion />
        <div
          className="grid grid-cols-1 lg:grid-cols-2 
                     gap-4 lg:gap-6 xl:gap-8 px-4 xl:px-0"
        >
          {prices.map((element, index) => {
            return (
              <div key={index}>
                <div
                  className="shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] 
                             rounded-lg py-6 px-8 xl:px-10 flex items-center"
                >
                  <div className="flex items-start md:items-center gap-12 md:gap-16">
                    <div className="flex flex-col items-center gap-4">
                      <h3 className="font-semibold text-xl underline">
                        {element.name}
                      </h3>
                      <img
                        className="w-24 lg:w-20 xl:w-24"
                        src={`/assets/${element.image}`}
                        alt={element.name}
                      />
                    </div>
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                        <div>
                          <label className="block font-semibold mb-1">
                            Quantity <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              defaultValue="0"
                              className="w-auto md:w-20 px-3 py-2 border-2 border-[#CE1567] 
                                         rounded-md hover:border-[#CE1567] focus:border-[#CE1567] 
                                         focus:outline-none"
                              onChange={(e) => {
                                quantityRefs.current[index] =
                                  parseInt(e.target.value, 10) || 0;
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">
                            Washing Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            className="px-3 py-2 border-2 border-[#CE1567] rounded-md 
                                       hover:border-[#CE1567] focus:border-[#CE1567] 
                                       focus:outline-none bg-white"
                            defaultValue=""
                            onChange={(e) => {
                              washTypeRefs.current[index] = e.target.value;
                            }}
                          >
                            <option value="" disabled>Select Wash Type</option>
                            <option value="simple_wash">Simple Wash</option>
                            <option value="power_clean">Power Clean</option>
                            <option value="dry_clean">Dry Clean</option>
                          </select>
                        </div>
                      </div>
                      <div
                        className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 w-fit"
                      >
                        <div>
                          <span
                            className="inline-flex items-center px-2 py-1 rounded-full 
                                       text-sm bg-white text-[#CE1567] border-2 border-[#CE1567]"
                          >
                            <HiMiniCurrencyRupee className="w-4 h-4 mr-1" />
                            {`${prices[index].prices.simple_wash} - Simple Wash`}
                          </span>
                        </div>
                        <div>
                          <span
                            className="inline-flex items-center px-2 py-1 rounded-full 
                                       text-sm bg-white text-[#CE1567] border-2 border-[#CE1567]"
                          >
                            <HiMiniCurrencyRupee className="w-4 h-4 mr-1" />
                            {`${prices[index].prices.power_clean} - Power Clean`}
                          </span>
                        </div>
                        <div>
                          <span
                            className="inline-flex items-center px-2 py-1 rounded-full 
                                       text-sm bg-white text-[#CE1567] border-2 border-[#CE1567]"
                          >
                            <HiMiniCurrencyRupee className="w-4 h-4 mr-1" />
                            {`${prices[index].prices.dry_clean} - Dry Clean`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div
            className="flex items-center lg:items-end justify-center lg:justify-end 
                       gap-5 mt-4 lg:mt-0"
          >
            <button
              className="bg-[#CE1567] text-white px-4 py-2 rounded-md 
                         hover:bg-[#bf0055] transition-colors"
              onClick={handleAddItems}
            >
              Add Items
            </button>
            <button
              className="bg-[#CE1567] text-white px-4 py-2 rounded-md 
                         hover:bg-[#bf0055] transition-colors flex items-center gap-2"
              onClick={handleCheckout}
            >
              Proceed
              <HiArrowLongRight size={30} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderCard;
