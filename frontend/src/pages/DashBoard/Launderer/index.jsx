import React, { useState } from 'react';
import { FiBox } from 'react-icons/fi';

import { Helmet } from 'react-helmet-async';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { RiAccountBoxLine, RiSettingsLine } from 'react-icons/ri';
import LaundererDetails from '../../../components/LaundererDetails';
import LaundererOrdersDetail from '../../../components/LaundererOrdersDetail';
import Navbar from '../../../components/Navbar';

function LaundererDashboard() {
  const [isActive, setIsActive] = useState(0);
  return (
    <>
      <Helmet>
        <title>LaundryHub - Dashboard</title>
        <meta name="description" content="" />
      </Helmet>
      <Navbar />
      <div className="flex justify-evenly pt-28">
        <div className="fixed left-0 top-[50px] sm:top-[55px] md:top-[70px] bottom-0 w-60 shadow-[0px_2px_3px_lightgray] pl-8 pr-4 pt-12">
          <div className="flex items-center gap-2 mb-8">
            <RiSettingsLine size={35} />
            <span className="font-semibold text-xl">Dashboard</span>
          </div>
          <div className="flex flex-col gap-4">
            <button
              className={`p-0 ${
                !isActive
                  ? 'text-white bg-lx-red'
                  : 'text-[#9197B3] bg-transparent'
              } hover:${
                !isActive ? 'bg-[#bf0055]' : 'bg-transparent'
              } rounded transition-colors`}
              onClick={() => setIsActive(0)}
            >
              <div className="w-full flex justify-between items-center px-4 py-3">
                <div className="flex items-center gap-2">
                  <RiAccountBoxLine size={20} />
                  <span>Profile</span>
                </div>
                <MdKeyboardArrowRight />
              </div>
            </button>
            <button
              className={`p-0 ${
                isActive
                  ? 'text-white bg-lx-red'
                  : 'text-[#9197B3] bg-transparent'
              } hover:${
                isActive ? 'bg-[#bf0055]' : 'bg-transparent'
              } rounded transition-colors`}
              onClick={() => setIsActive(1)}
            >
              <div className="w-full flex justify-between items-center px-4 py-3">
                <div className="flex items-center gap-2">
                  <FiBox size={20} />
                  <span>Orders</span>
                </div>
                <MdKeyboardArrowRight />
              </div>
            </button>
          </div>
        </div>
        <div className="flex justify-evenly items-center pt-12 pl-20">
          {!isActive ? <LaundererDetails /> : <LaundererOrdersDetail />}
        </div>
      </div>
    </>
  );
}

export default LaundererDashboard;
