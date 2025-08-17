import React, { useEffect, useState } from 'react';
import { BiBell, BiLogOut, BiUserCheck, BiUserPlus } from 'react-icons/bi';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoIosClose } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../Store/AuthStore';
import { deleteNotif, fetchNotifs, logout } from '../../utils/apis';

function Navbar() {
  const {
    isAuth,
    removeAuth,
    userName,
    userNotifications,
    unreadCount,
    updateUserNotifications,
    clearUserNotifications,
    removeUserNotification,
    setUnreadCount,
  } = useAuthStore();
  
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  const showToast = (message, type = 'info') => {
    alert(message);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetchNotifs();
        if (
          !response.data.notifications ||
          response.data.notifications.length === 0
        ) {
          console.log('No notifs');
          return;
        }
        updateUserNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      } catch (error) {
        console.error('Error fetching notifications', error);
      }
    };

    if (isAuth) {
      fetchNotifications();
    }
  }, [isAuth, updateUserNotifications, setUnreadCount]);

  const logOut = async () => {
    try {
      const response = await logout();
      showToast('User Logged Out Successfully');
      removeAuth();
      clearUserNotifications();
      setUnreadCount(0);
      navigate('/');
    } catch (err) {
      showToast('Unauthorized - redirecting to login');
      removeAuth();
      navigate('/login');
    }
  };

  const deleteNotification = async (id) => {
    try {
      const response = await deleteNotif(id);

      if (response.status === 200) {
        setUnreadCount((prevCount) => prevCount - 1);
        removeUserNotification(id);
      }
    } catch (err) {
      console.error('Error deleting notification', err);
    }
  };

  return (
    <nav className="fixed top-0 w-full h-12 sm:h-14 lg:h-[70px] bg-white shadow-sm z-10 flex items-center pr-4 sm:pr-8">
      <Link to="/" className="ml-5 sm:ml-8 lg:ml-10 xl:ml-12">
        <h1 className="text-[#584BAC] font-semibold text-xl sm:text-2xl lg:text-4xl xl:text-5xl">
          LaundryHub
        </h1>
      </Link>
      
      <div className="flex-1"></div>
      
      {}
      <div className="hidden md:block">
        {isAuth ? (
          <div className="flex justify-center items-center gap-6">
            {}
            <div className="relative">
              <button
                className="rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer relative"
                onClick={() => setIsNotificationMenuOpen(!isNotificationMenuOpen)}
              >
                <BiBell
                  className={`text-[#584bac] hover:text-[#ce1567] ${unreadCount > 0 ? 'bell-icon' : ''}`}
                  size={28}
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.5rem] text-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {}
              {isNotificationMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border-2 border-[#ce1584] rounded-lg p-4 shadow-lg z-20">
                  {userNotifications.length > 0 ? (
                    <div className="space-y-3">
                    {userNotifications.map((notification, index) => (
                      <div key={index} className="flex items-center p-2 border-b border-gray-100 last:border-b-0">
                        <BiBell className="text-[#ce1584] mr-2" size={16} />
                        <span className="flex-1 text-sm">{notification.message}</span>
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="ml-auto p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <IoIosClose className="text-red-500" size={20} />
                        </button>
                      </div>
                    ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center py-4">No notifications</div>
                  )}
                </div>
              )}
            </div>
            
            <Link to="/dashboard" className="flex items-center bg-gray-50 hover:bg-gray-200 rounded-full py-2 px-4 transition-colors duration-200 cursor-pointer">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#584BAC] text-white rounded-full flex items-center justify-center text-sm font-medium mr-2">
                  {userName ? userName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-[#584BAC] font-semibold text-xs sm:text-sm lg:text-base xl:text-lg hover:text-[#ce1567]">
                  Account
                </span>
              </div>
            </Link>
            
            <button
              className="bg-transparent text-[#584BAC] hover:bg-gray-200 hover:text-[#ce1567] rounded-lg px-8 py-2 transition-colors text-lg"
              onClick={logOut}
            >
              Log Out
            </button>
          </div>
        ) : (
          <div className="flex">
            <button
              className="bg-transparent hover:text-[#ce1567] rounded-lg px-8 py-2 transition-colors text-lg"
              onClick={() => navigate('/login')}
            >
              Log In
            </button>
            <button
              className="bg-[#ce1567] hover:bg-[#bf0055] text-white rounded-lg px-8 py-2 ml-6 transition-colors text-lg"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>

      {}
      <div className="block md:hidden">
        <button
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          <GiHamburgerMenu size={30} className="text-[#584bac]" />
        </button>
        
        {}
        {isMobileMenuOpen && (
          <div className="absolute right-4 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            {isAuth ? (
              <div className="py-2">
                <Link 
                  to="/dashboard" 
                  className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="w-6 h-6 bg-[#584BAC] text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  Dashboard
                </Link>
                
                <button
                  className="flex items-center w-full px-4 py-3 hover:bg-gray-50 transition-colors text-lg text-left"
                  onClick={() => {
                    setIsNotificationDrawerOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <div className="relative mr-3">
                    <BiBell size={24} className="text-[#584bac]" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 min-w-[1rem] text-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  Notifications
                </button>
                
                <button
                  className="flex items-center w-full px-4 py-3 hover:bg-gray-50 transition-colors text-lg text-left"
                  onClick={() => {
                    logOut();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <BiLogOut size={24} className="text-[#584bac] mr-3" />
                  Logout
                </button>
              </div>
        
        {}
        {isNotificationDrawerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setIsNotificationDrawerOpen(false)}>
            <div className="fixed left-0 top-0 w-80 h-full bg-white shadow-lg z-40" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Notifications</h3>
                <button
                  onClick={() => setIsNotificationDrawerOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <IoIosClose size={24} />
                </button>
              </div>
              <div className="p-4">
                {userNotifications.length > 0 ? (
                  <div className="space-y-3">
                    {userNotifications.map((notification, index) => (
                      <div key={index} className="flex items-center p-2 border-b border-gray-100 last:border-b-0">
                        <BiBell className="text-[#ce1584] mr-2" size={16} />
                        <span className="flex-1 text-sm">{notification.message}</span>
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="ml-auto p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <IoIosClose className="text-red-500" size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-4">No notifications</div>
                )}
              </div>
            </div>
          </div>
        )}
            ) : (
              <div className="py-2">
                <button
                  className="flex items-center w-full px-4 py-3 hover:bg-gray-50 transition-colors text-lg text-left"
                  onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <BiUserCheck size={24} className="text-[#584bac] mr-3" />
                  Log In
                </button>
                <button
                  className="flex items-center w-full px-4 py-3 hover:bg-gray-50 transition-colors text-lg text-left"
                  onClick={() => {
                    navigate('/signup');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <BiUserPlus size={24} className="text-[#584bac] mr-3" />
                  Sign Up
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
