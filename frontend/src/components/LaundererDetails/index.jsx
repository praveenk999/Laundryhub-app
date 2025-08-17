import React, { useRef, useState } from 'react';
import { FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import useAuthStore from '../Store/AuthStore';
import { updateUserDetails } from '../../utils/apis';

function LaundererDetails() {
  const {
    userName,
    userEmail,
    Phone,
    setUserName,
    setUserEmail,
    setUserPhone,
  } = useAuthStore((state) => ({
    userName: state.userName,
    userEmail: state.userEmail,
    Phone: state.Phone,
    setUserName: state.setUserName,
    setUserEmail: state.setUserEmail,
    setUserPhone: state.setUserPhone,
  }));
  const usernameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);

  const [isEditMode, setIsEditMode] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getChangedData = (initialData, currentData) => {
    const changedData = {};
    const changedFields = [];
    for (const key in currentData) {
      if (currentData[key] !== initialData[key]) {
        changedData[key] = currentData[key];
        changedFields.push(key);
      }
    }
    return { changedData, changedFields };
  };

  const initialData = {
    username: userName,
    phone_number: Phone,
    email: userEmail,
  };

  const handleToast = (title, description) => {
    alert(`${title}: ${description}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentData = {
      username: usernameRef.current.value,
      phone_number: phoneRef.current.value,
      email: emailRef.current.value,
    };

    const { changedData, changedFields } = getChangedData(
      initialData,
      currentData
    );

    if (changedFields.length === 0) {
      handleToast('No changes made', '', 'info');
      return;
    }
    try {
      const response = await updateUserDetails(changedData);

      changedFields.forEach((field) => {
        switch (field) {
          case 'username':
            setUserName(changedData.username);
            break;
          case 'phone_number':
            setUserPhone(changedData.phone_number);
            break;
          case 'email':
            setUserEmail(changedData.email);
            break;
          default:
            break;
        }
      });
      handleToast('Updated', 'Student details updated', 'success');
      setIsEditMode(false);
    } catch (err) {
      let errorDescription = '';
      if (err.response.data.errors.username) {
        errorDescription += err.response.data.errors.username;
      } else if (err.response.data.errors.email) {
        errorDescription += err.response.data.errors.email;
      } else if (err.response.data.errors.role) {
        errorDescription += err.response.data.errors.role;
      } else if (err.response.data.errors.phone_number) {
        errorDescription += err.response.data.errors.phone_number;
      }
      handleToast(
        'Error while updating launderer data',
        errorDescription,
        'error'
      );
    }
  };

  const handleOpen = () => {
    openModal();
    setTimeout(() => {
      if (usernameRef.current) usernameRef.current.value = userName || '';
      if (phoneRef.current) phoneRef.current.value = Phone || '';
      if (emailRef.current) emailRef.current.value = userEmail || '';
    }, 0);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 pt-16">
      <div
        className="rounded-2xl px-8 md:px-12 py-8 md:py-12 
                   w-auto md:w-auto lg:w-auto xl:w-[40rem] 2xl:w-[45rem] 
                   mb-8 bg-white border-2 border-[#ce1567] 
                   shadow-[0px_0px_20px_0px_rgba(0,0,0,0.20)] mx-auto"
      >
        <div
          className={`flex items-center ${
            isMobile ? 'justify-center flex-col' : 'justify-between'
          } mb-4`}
        >
          <h2
            className={`text-center text-[#292929] 
                       text-2xl md:text-3xl font-light 
                       ${!isMobile ? 'mb-0' : 'mb-4'}`}
          >
            User Details
          </h2>
          {!isMobile && (
            <button
              onClick={handleOpen}
              className="bg-[#ce1567] text-white text-center w-28 py-2 rounded
                         hover:text-[#292929] hover:bg-[#ce1567] transition-colors
                         mb-4"
            >
              Edit
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="flex items-center mb-2">
            <FaUser className="mr-2" />
            <span className="text-base md:text-xl font-medium">
              <strong>Username:</strong> {userName}
            </span>
          </div>

          <div className="flex items-center mb-2">
            <FaPhone className="mr-2" />
            <span className="text-base md:text-xl font-medium">
              <strong>Phone:</strong> {Phone}
            </span>
          </div>
          
          <div className="flex items-center mb-2">
            <FaEnvelope className="mr-2" />
            <span className="text-base md:text-xl font-medium">
              <strong>Email:</strong> {userEmail}
            </span>
          </div>
        </div>
        
        {isMobile && (
          <button
            onClick={openModal}
            className="bg-[#ce1567] text-white text-center w-28 py-2 rounded
                       hover:text-[#292929] hover:bg-[#ce1567] transition-colors
                       mt-8 mx-auto block"
          >
            Edit
          </button>
        )}
      </div>

      {}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-center flex-1">
                User Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <IoClose size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="border-2 border-[#292929] w-full px-4 md:px-8 py-4 md:py-8 rounded-2xl shadow-md bg-white">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="username"
                        type="text"
                        name="username"
                        ref={usernameRef}
                        disabled={!isEditMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ce1567] disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone_number"
                        ref={phoneRef}
                        disabled={!isEditMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ce1567] disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        ref={emailRef}
                        disabled={!isEditMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ce1567] disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                  
                  {isEditMode && (
                    <button
                      type="submit"
                      className="w-full mt-8 bg-[#ce1567] text-white py-2 rounded-md hover:bg-[#b50055] transition-colors"
                    >
                      Save
                    </button>
                  )}
                </form>
              </div>
            </div>

            <div className="flex justify-end p-6 border-t space-x-3">
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`px-4 py-2 rounded-md text-white transition-colors ${
                  isEditMode
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-[#ce1567] hover:bg-[#b50055]'
                }`}
              >
                {isEditMode ? 'Cancel' : 'Edit Details'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LaundererDetails;
