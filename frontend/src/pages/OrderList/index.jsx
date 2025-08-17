import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../../components/Navbar';
import OrderCard from '../../components/OrderCard';

function OrderList() {
  return (
    <>
      <Helmet>
        <title>LaundryHub - Add Items</title>
        <meta name="description" content="" />
      </Helmet>
      <Navbar />
      <div>
        <OrderCard />
      </div>
    </>
  );
}

export default OrderList;
