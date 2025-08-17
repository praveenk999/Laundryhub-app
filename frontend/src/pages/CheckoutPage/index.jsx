import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../../components/Navbar';
import OrderItemsAccordion from '../../components/OrderItemsAccordion';
import ScheduleCard from '../../components/ScheduleCard';

function CheckoutPage() {
  return (
    <>
      <Helmet>
        <title>LaundryHub - Schedule Order</title>
        <meta name="description" content="" />
      </Helmet>
      <Navbar />
      <div className="flex justify-center">
        <h1 className="mt-24 font-semibold text-2xl">Schedule Your Order</h1>
      </div>
      <div className="flex flex-col-reverse xl:flex-row justify-center items-center gap-16 xl:gap-32 mt-8 md:mt-20 pb-16 xl:pb-0">
        <OrderItemsAccordion />
        <ScheduleCard />
      </div>
    </>
  );
}
export default CheckoutPage;
