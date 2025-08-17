import { useRef, useState } from 'react';
import { BiHide, BiShow } from 'react-icons/bi';
import { HiArrowLongRight } from 'react-icons/hi2';
import { FaUserTie } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../Store/AuthStore';
import { login, forgotPassword } from '../../utils/apis';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  const initialRef = useRef();
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);










import { useRef, useState } from 'react';
import { BiHide, BiShow } from 'react-icons/bi';
import { HiArrowLongRight } from 'react-icons/hi2';
import { FaUserTie } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../Store/AuthStore';
import { login, forgotPassword } from '../../utils/apis';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  const initialRef = useRef();
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const {
    addAuth,
    setUserName,
    setUserRole,
    setUserEmail,
    setUserPhone,
    setUserHostel,
    setUserRoomNumber,
    setUserRollNumber,
  } = useAuthStore((state) => ({
    addAuth: state.addAuth,
    setUserName: state.setUserName,
    setUserRole: state.setUserRole,
    setUserEmail: state.setUserEmail,
    setUserPhone: state.setUserPhone,
    setUserHostel: state.setUserHostel,
    setUserRoomNumber: state.setUserRoomNumber,
    setUserRollNumber: state.setUserRollNumber,
  }));

  const navigate = useNavigate();

  const showToastMessage = (title, description, type) => {
    setToastMessage(`${title}: ${description}`);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleGuestLogin = () => {
    if (usernameRef.current && passwordRef.current) {
      usernameRef.current.value = 'guest';
      passwordRef.current.value = 'Guest@1234';
      showToastMessage('Guest Credentials Filled', 'You can now login with demo credentials', 'info');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const credentials = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    if (!(credentials.username && credentials.password)) {
      showToastMessage('Incomplete Entries', 'Please fill all the fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await login(credentials);

      addAuth();
      setUserName(credentials.username);
      setUserRole(response.data.role);
      setUserEmail(response.data.email);
      setUserPhone(response.data.phone_number);
      setUserHostel(response.data.hostel);
      setUserRoomNumber(response.data.room_number);
      setUserRollNumber(response.data.roll_number);

      showToastMessage('Success', 'Successfully logged in!', 'success');
      navigate('/');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      let errorDescription = '';
      if (err.response.data.errors.username) {
        errorDescription += err.response.data.errors.username;
      } else if (err.response.data.errors.password) {
        errorDescription += err.response.data.errors.password;
      }
      showToastMessage('Error', errorDescription, 'error');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    const email = initialRef.current.value;
    try {
      if (email) {
        const response = forgotPassword(email);
        showToastMessage('Success', 'Password reset link is sent to your email', 'success');
      } else {
        throw new Error('Please enter your email');
      }
    } catch (error) {
      showToastMessage('Error', error.message, 'error');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 via-pink-400 via-red-400 to-blue-500 bg-[length:400%_400%] animate-gradient-shift flex items-center justify-center p-4">
      {}
      {showToast && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white transform transition-all duration-300 ${
            toastType === 'success'
              ? 'bg-green-500'
              : toastType === 'error'
                ? 'bg-red-500'
                : 'bg-blue-500'
          }`}
        >
          {toastMessage}
        </div>
      )}

      <div className="w-full max-w-md space-y-8 animate-fade-in-up">
        {}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-wider drop-shadow-lg">
            Welcome Back
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-normal">
            Sign in to your LaundriX account
          </p>
        </div>

        {}
        <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl text-center transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl">
          <h2 className="text-lg font-bold mb-3 text-white drop-shadow-sm">
            🎯 Demo Access for Interviewers
          </h2>
          <button
            onClick={handleGuestLogin}
            className="inline-flex items-center px-6 py-3 bg-white/20 text-white border border-white/30 rounded-lg font-semibold tracking-wide transition-all duration-300 hover:bg-white/30 hover:transform hover:-translate-y-1 hover:shadow-lg"
          >
            <FaUserTie className="mr-2" />
            Fill Guest Credentials
          </button>
          <p className="text-sm mt-3 text-white/80">
            Click to auto-fill demo login details
          </p>
        </div>

        {}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-2xl transition-all duration-300 hover:shadow-3xl">
          <form onSubmit={onSubmit} className="space-y-6">
            {}
            <div>
              <label
                htmlFor="username"
                className="block text-lg font-semibold text-gray-700 tracking-wide mb-3"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                ref={usernameRef}
                placeholder="Enter your username..."
                className="w-full px-4 py-4 text-md bg-white border-2 border-gray-200 rounded-xl focus:border-pink-600 focus:outline-none focus:ring-3 focus:ring-pink-100 transition-all duration-200 hover:border-pink-600"
              />
            </div>

            {}
            <div>
              <label
                htmlFor="password"
                className="block text-lg font-semibold text-gray-700 tracking-wide mb-3"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  ref={passwordRef}
                  placeholder="Enter your password..."
                  className="w-full px-4 py-4 text-md bg-white border-2 border-gray-200 rounded-xl focus:border-pink-600 focus:outline-none focus:ring-3 focus:ring-pink-100 transition-all duration-200 hover:border-pink-600 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-pink-600 transition-colors duration-200"
                >
                  {showPassword ? <BiHide size={24} /> : <BiShow size={24} />}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-pink-600 text-sm font-semibold mt-3 hover:underline hover:text-pink-800 transition-colors duration-200"
              >
                Forgot Password?
              </button>
            </div>

            {}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-pink-600 to-pink-800 text-white font-bold text-lg tracking-wide rounded-xl transition-all duration-300 hover:from-pink-800 hover:to-pink-600 hover:transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
              ) : (
                <>
                  <span>Sign In</span>
                  <HiArrowLongRight size={24} />
                </>
              )}
            </button>
          </form>
        </div>

        {}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
          <p className="text-sm text-white/90 mb-2 font-semibold">Demo Credentials</p>
          <div className="space-y-1 text-xs text-white/80">
            <p>👤 Username: <strong>guest</strong></p>
            <p>🔑 Password: <strong>Guest@1234</strong></p>
          </div>
        </div>

        <div className="border-t border-white/30 pt-6">
          {}
          <p className="text-lg md:text-xl text-white text-center">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-white font-bold underline hover:text-white/80 transition-colors duration-200"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border-2 border-pink-600 mx-4 w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-pink-600 text-center mb-6">
                Reset Password
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
              <form onSubmit={handleForgotPassword}>
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-md font-semibold text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your registered email"
                    ref={initialRef}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-600 focus:outline-none focus:ring-3 focus:ring-pink-100"
                  />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-pink-600 to-pink-800 text-white font-semibold rounded-lg transition-all duration-200 hover:from-pink-800 hover:to-pink-600 hover:transform hover:-translate-y-1"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
