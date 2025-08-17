import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { FaTruckPickup, FaUser } from 'react-icons/fa';
import { FaLocationCrosshairs, FaLocationDot } from 'react-icons/fa6';
import { TbTruckDelivery } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../Store/AuthStore';
import useOrderStore from '../Store/OrderStore';
import { createOrder, fetchLaunderers, postNotif } from '../../utils/apis';

function ScheduleCard() {
  const {
    clearSchedule,
    order,
    setPickupDate,
    setPickupTime,
    setDeliveryTime,
    setPickupAddress,
    setDeliveryAddress,
    setLaunderer,
    clearItems,
  } = useOrderStore((state) => ({
    clearSchedule: state.clearSchedule,
    order: state.order,
    setPickupDate: state.setPickupDate,
    setPickupTime: state.setPickupTime,
    setDeliveryTime: state.setDeliveryTime,
    setPickupAddress: state.setPickupAddress,
    setDeliveryAddress: state.setDeliveryAddress,
    setLaunderer: state.setLaunderer,
    clearItems: state.clearItems,
  }));
  const { userName, userHostel, userRollNumber } = useAuthStore((state) => ({
    userName: state.userName,
    userHostel: state.userHostel,
    userRollNumber: state.userRollNumber,
  }));
  const [loading, setLoading] = useState(true);
  const pickupDateRef = useRef();
  const pickupTimeRef = useRef();
  const deliveryTimeRef = useRef();
  const pickupAddressRef = useRef();
  const deliveryAddressRef = useRef();
  const laundererRef = useRef();
  const launderersRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    const getLaunderers = async () => {
      try {
        const response = await fetchLaunderers();
        launderersRef.current = response.data;
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    getLaunderers();
  }, []);

  const handleToast = (title, description) => {
    alert(`${title}: ${description}`);
  };

  const handleConfirmSchedule = () => {
    if (
      !pickupDateRef.current.value ||
      !pickupTimeRef.current.value ||
      !deliveryTimeRef.current.value ||
      !pickupAddressRef.current.value ||
      !deliveryAddressRef.current.value ||
      !laundererRef.current.value
    ) {
      handleToast('Please confirm all the details.', '');
      return;
    }
    setPickupDate(pickupDateRef.current.value);
    setPickupTime(pickupTimeRef.current.value);
    setDeliveryTime(deliveryTimeRef.current.value);
    setPickupAddress(pickupAddressRef.current.value);
    setDeliveryAddress(deliveryAddressRef.current.value);
    setLaunderer(laundererRef.current.value);
    handleToast(
      'All schedule details are added.',
      'Order can now be confirmed and placed.'
    );
  };

  const handleConfirmOrder = async () => {
    if (
      !order.pickupDate ||
      !order.pickupTime ||
      !order.deliveryTime ||
      !order.pickupAddress ||
      !order.deliveryAddress ||
      !order.launderer
    ) {
      handleToast('Please confirm schedule details first.', '');
      return;
    }
    if (order.items.length === 0) {
      handleToast('Please add items to the order first.', '');
      return;
    }

    try {
      const response = await createOrder(order);
      clearItems();
      clearSchedule();
      handleToast('Order placed successfully!', '');
      await postNotif({
        student_id: userRollNumber,
        launderer_id: order.launderer,
        order_id: response.data.order.id,
        message: `Hi! ${userName} has placed a new order. Please check your dashboard for more details.`,
      });
      navigate('/');
    } catch (err) {
      let errorDescription = '';
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        Object.keys(errors).forEach((key) => {
          errorDescription += `${errors[key]} `;
        });
      } else {
        errorDescription = 'Failed to place order. Please try again.';
      }
      handleToast('Error placing order', errorDescription);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="flex flex-col md:flex-row border-2 border-gray-500 
                   shadow-[0px_0px_20px_0px_rgba(0,0,0,0.20)] rounded-2xl 
                   justify-center w-80 md:w-[32rem] py-8 px-8 md:px-10 
                   gap-6 md:gap-8"
      >
        {}
        <div className="flex flex-col justify-between items-start gap-4 md:gap-0">
          <div className="flex items-center gap-2">
            <FaTruckPickup color="#CE1567" size="25" />
            <span className="text-[#CE1567] font-semibold">
              Pickup Schedule
            </span>
          </div>
          <select
            className="border-2 border-[#584BAC] rounded-md px-3 py-2 w-auto
                       hover:border-[#584BAC] focus:border-[#584BAC] focus:outline-none"
            ref={pickupDateRef}
            defaultValue=""
          >
            <option value="" disabled>Select Date</option>
            <option value={moment().format('ddd, D MMM YYYY')}>
              {moment().format('ddd, D MMM YYYY')}
            </option>
            <option value={moment().add(1, 'days').format('ddd, D MMM YYYY')}>
              {moment().add(1, 'days').format('ddd, D MMM YYYY')}
            </option>
            <option value={moment().add(2, 'days').format('ddd, D MMM YYYY')}>
              {moment().add(2, 'days').format('ddd, D MMM YYYY')}
            </option>
          </select>
          <select
            className="border-2 border-[#584BAC] rounded-md px-3 py-2 w-auto
                       hover:border-[#584BAC] focus:border-[#584BAC] focus:outline-none"
            ref={pickupTimeRef}
            defaultValue=""
          >
            <option value="" disabled>Select Time</option>
            <option value="Morning(8-12)">Morning(8-12)</option>
            <option value="Afternoon(12-4)">Afternoon(12-4)</option>
            <option value="Evening(4-8)">Evening(4-8)</option>
          </select>
        </div>

        {}
        <div
          className="border-t-2 md:border-l-2 md:border-t-0 border-[#584BAC] 
                     w-full md:w-0 h-0 md:h-full"
        />

        {}
        <div className="flex flex-col justify-between items-start gap-4 md:gap-0">
          <div className="flex items-center gap-2">
            <TbTruckDelivery color="#CE1567" size="25" />
            <span className="text-[#CE1567] font-semibold">
              Delivery Schedule
            </span>
          </div>
          <span>{order.deliveryDate}</span>
          <select
            className="border-2 border-[#584BAC] rounded-md px-3 py-2 w-auto
                       hover:border-[#584BAC] focus:border-[#584BAC] focus:outline-none"
            ref={deliveryTimeRef}
            defaultValue=""
          >
            <option value="" disabled>Select Time</option>
            <option value="Morning(8-12)">Morning(8-12)</option>
            <option value="Afternoon(12-4)">Afternoon(12-4)</option>
            <option value="Evening(4-8)">Evening(4-8)</option>
          </select>
        </div>
      </div>

      {}
      <div
        className="flex flex-col border-2 border-gray-500 
                   shadow-[0px_0px_20px_0px_rgba(0,0,0,0.20)] rounded-2xl 
                   w-80 md:w-[32rem] py-8 px-8 md:px-10 gap-6"
      >
        {}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <FaLocationDot color="#CE1567" size="20" />
            </div>
            <span className="text-[#CE1567] font-semibold">
              Pickup Address
            </span>
          </div>
          <select
            className="border-2 border-[#584BAC] rounded-md px-3 py-2
                       hover:border-[#584BAC] focus:border-[#584BAC] focus:outline-none
                       w-32 md:w-40"
            ref={pickupAddressRef}
            defaultValue=""
          >
            <option value="" disabled>Select Address</option>
            <option value={`${userHostel}, NITW`}>
              {userHostel}, NITW
            </option>
          </select>
        </div>

        {}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <FaLocationCrosshairs color="#CE1567" size="20" />
            </div>
            <span className="text-[#CE1567] font-semibold">
              Delivery Address
            </span>
          </div>
          <select
            className="border-2 border-[#584BAC] rounded-md px-3 py-2
                       hover:border-[#584BAC] focus:border-[#584BAC] focus:outline-none
                       w-32 md:w-40"
            ref={deliveryAddressRef}
            defaultValue=""
          >
            <option value="" disabled>Select Address</option>
            <option value={`${userHostel}, NITW`}>
              {userHostel}, NITW
            </option>
          </select>
        </div>

        {}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <FaUser color="#CE1567" size="20" />
            </div>
            <span className="text-[#CE1567] font-semibold">
              Select Launderer
            </span>
          </div>
          <select
            className="border-2 border-[#584BAC] rounded-md px-3 py-2
                       hover:border-[#584BAC] focus:border-[#584BAC] focus:outline-none
                       w-32 md:w-40"
            ref={laundererRef}
            defaultValue=""
          >
            <option value="" disabled>Select Launderer</option>
            {!loading &&
              launderersRef.current?.map((launderer) => (
                <option key={launderer.id} value={launderer.id}>
                  {launderer.username}
                </option>
              ))}
          </select>
        </div>

        {}
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <button
            className="bg-[#CE1567] text-white px-6 py-2 rounded-md 
                       hover:bg-[#bf0055] transition-colors w-full md:w-auto"
            onClick={handleConfirmSchedule}
          >
            Confirm Schedule
          </button>
          <button
            className="bg-[#CE1567] text-white px-6 py-2 rounded-md 
                       hover:bg-[#bf0055] transition-colors w-full md:w-auto"
            onClick={handleConfirmOrder}
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScheduleCard;
