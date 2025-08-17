import React, { useRef, useState } from 'react';
import {
  FaBuilding,
  FaDoorOpen,
  FaEnvelope,
  FaIdBadge,
  FaPhone,
  FaUser,
} from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import useAuthStore from '../Store/AuthStore';
import { updateUserDetails } from '../../utils/apis';

function StudentDetails() {
  const {
    userName,
    userEmail,
    Phone,
    userHostel,
    userRoomNumber,
    userRollNumber,
    setUserName,
    setUserEmail,
    setUserPhone,
    setUserRoomNumber,
    setUserHostel,
    setUserRollNumber,
  } = useAuthStore((state) => ({
    userName: state.userName,
    userEmail: state.userEmail,
    Phone: state.Phone,
    userHostel: state.userHostel,
    userRoomNumber: state.userRoomNumber,
    userRollNumber: state.userRollNumber,
    setUserName: state.setUserName,
    setUserEmail: state.setUserEmail,
    setUserPhone: state.setUserPhone,
    setUserRoomNumber: state.setUserRoomNumber,
    setUserHostel: state.setUserHostel,
    setUserRollNumber: state.setUserRollNumber,
  }));

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
    password: '',
    hostel: userHostel,
    room_number: userRoomNumber,
    roll_number: userRollNumber,
  };

  const usernameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const hostelRef = useRef(null);
  const roomRef = useRef(null);
  const rollRef = useRef(null);

  const [isEditMode, setIsEditMode] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isLargerThan768px, setIsLargerThan768px] = useState(false);

  const showToast = (title, description, type = 'info') => {
    alert(`${title}: ${description}`);
  };

  const onClose = () => setIsOpen(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsLargerThan768px(window.innerWidth >= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleToast = (title, description, status) => {
    showToast(title, description, status);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentData = {
      username: usernameRef.current.value,
      phone_number: phoneRef.current.value,
      email: emailRef.current.value,
      hostel: hostelRef.current.value,
      room_number: roomRef.current.value,
      roll_number: rollRef.current.value,
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
          case 'hostel':
            setUserHostel(changedData.hostel);
            break;
          case 'email':
            setUserEmail(changedData.email);
            break;
          case 'room_number':
            setUserRoomNumber(changedData.room_number);
            break;
          case 'roll_number':
            setUserRollNumber(changedData.roll_number);
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
        'Error while updating student data',
        errorDescription,
        'error'
      );
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => {
      if (usernameRef.current) usernameRef.current.value = userName || '';
      if (phoneRef.current) phoneRef.current.value = Phone || '';
      if (emailRef.current) emailRef.current.value = userEmail || '';
      if (hostelRef.current) hostelRef.current.value = userHostel || '';
      if (roomRef.current) roomRef.current.value = userRoomNumber || '';
      if (rollRef.current) rollRef.current.value = userRollNumber || '';
    }, 0);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-16">
      <div
        className="bg-white border-2 border-[#ce1567] rounded-2xl px-8 lg:px-12 py-8 lg:py-12 shadow-md w-auto lg:w-[40rem] xl:w-[45rem] mb-8 mx-auto"
        style={{ boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, 0.20)' }}
      >
        <div
          className={`flex items-center ${
            isLargerThan768px ? 'justify-between' : 'justify-center flex-col'
          } mb-4`}
        >
          <h2
            className={`text-[#292929] text-2xl lg:text-3xl font-light ${
              isLargerThan768px ? 'mb-0' : 'mb-4'
            }`}
          >
            User Details
          </h2>
          {isLargerThan768px && (
            <button
              onClick={handleOpen}
              className="bg-[#ce1567] text-white w-28 py-2 rounded hover:bg-[#b50055] mb-4"
            >
              Edit
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="flex items-center mb-2">
            <FaUser className="mr-2" />
            <span className="text-base lg:text-xl font-medium">
              <strong>Username:</strong> {userName}
            </span>
          </div>
          <div className="flex items-center mb-2">
            <FaPhone className="mr-2" />
            <span className="text-base lg:text-xl font-medium">
              <strong>Phone:</strong> {Phone}
            </span>
          </div>
          <div className="flex items-center mb-2">
            <FaEnvelope className="mr-2" />
            <span className="text-base lg:text-xl font-medium">
              <strong>Email:</strong> {userEmail}
            </span>
          </div>
          <div className="flex items-center mb-2">
            <FaBuilding className="mr-2" />
            <span className="text-base lg:text-xl font-medium">
              <strong>Hostel:</strong> {userHostel}
            </span>
          </div>
          <div className="flex items-center mb-2">
            <FaIdBadge className="mr-2" />
            <span className="text-base lg:text-xl font-medium">
              <strong>Roll Number:</strong> {userRollNumber}
            </span>
          </div>
          <div className="flex items-center">
            <FaDoorOpen className="mr-2" />
            <span className="text-base lg:text-xl font-medium">
              <strong>Room Number:</strong> {userRoomNumber}
            </span>
          </div>
        </div>
        {!isLargerThan768px && (
          <button
            onClick={handleOpen}
            className="bg-[#ce1567] text-white w-28 py-2 rounded hover:bg-[#b50055] mt-8 mx-auto block"
          >
            Edit
          </button>
        )}
      </div>

      {}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="text-center p-6 border-b">
              <h2 className="text-xl font-semibold">Student Details</h2>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <IoClose size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="border-2 border-[#292929] rounded-2xl p-4 lg:p-8 bg-white shadow-md">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="username">
                        Username *
                      </label>
                      <input
                        type="text"
                        name="username"
                        ref={usernameRef}
                        disabled={!isEditMode}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#ce1567] disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="phone">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone_number"
                        ref={phoneRef}
                        disabled={!isEditMode}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#ce1567] disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="email">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        ref={emailRef}
                        disabled={!isEditMode}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#ce1567] disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="hostel">
                        Hostel *
                      </label>
                      <select
                        name="hostel"
                        ref={hostelRef}
                        disabled={!isEditMode}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#ce1567] disabled:bg-gray-100"
                      >
                        <option value="1K">1K</option>
                        <option value="1.8K">1.8K</option>
                        <option value="LH">LH</option>
                        <option value="DASA Hall">DASA Hall</option>
                        <option value="Block 1">Block 1</option>
                        <option value="Block 2">Block 2</option>
                        <option value="Block 3">Block 3</option>
                        <option value="Block 4">Block 4</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="roll">
                        Roll Number *
                      </label>
                      <input
                        type="text"
                        name="roll_number"
                        ref={rollRef}
                        disabled={!isEditMode}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#ce1567] disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="room">
                        Room *
                      </label>
                      <input
                        type="text"
                        name="room_number"
                        ref={roomRef}
                        disabled={!isEditMode}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#ce1567] disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                  {isEditMode && (
                    <button
                      type="submit"
                      className="w-full mt-8 py-3 bg-[#ce1567] text-white rounded hover:bg-[#b50055] transition-colors"
                    >
                      Save
                    </button>
                  )}
                </form>
              </div>
            </div>

            <div className="flex justify-end p-6 border-t gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`px-4 py-2 text-white rounded transition-colors ${
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

export default StudentDetails;
