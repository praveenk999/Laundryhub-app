import { useEffect, useRef, useState } from 'react';
import { BiHide, BiShow } from 'react-icons/bi';
import { HiArrowLongRight } from 'react-icons/hi2';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../Store/AuthStore';
import { signup } from '../../utils/apis';

export default function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const roleRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const { addAuth, setUserName, setUserEmail, setUserPhone, setUserRole } =
    useAuthStore((state) => ({
      addAuth: state.addAuth,
      setUserName: state.setUserName,
      setUserEmail: state.setUserEmail,
      setUserPhone: state.setUserPhone,
      setUserRole: state.setUserRole,
    }));

  const navigate = useNavigate();
  
  const showToast = (title, description, type = 'info') => {
    alert(`${title}: ${description}`); 
  };
  
  const handleToast = (title, description, status) => {
    showToast(title, description, status);
  };
  useEffect(() => {
    if (loading) {
    }
  }, [loading]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const credentials = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      role: roleRef.current.value,
      phone_number: phoneRef.current.value,
      confirmPassword: confirmPasswordRef.current.value,
    };

    if (
      !(
        credentials.email &&
        credentials.password &&
        credentials.username &&
        credentials.phone_number &&
        credentials.role
      )
    ) {
      handleToast('Incomplete Entries', 'Please enter all the fields', 'error');
      return;
    }
    if (credentials.password !== credentials.confirmPassword) {
      handleToast(
        'Password Mismatch',
        'Password and Confirm Password do not match',
        'error'
      );
      return;
    }
    setLoading(true);
    try {
      const response = await signup(credentials);

      addAuth();
      setUserName(credentials.username);
      setUserEmail(credentials.email);
      setUserPhone(credentials.phone_number);
      setUserRole(credentials.role);
      handleToast(
        'Account Created',
        'You have successfully created an account',
        'success'
      );
      navigate('/');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      let errorDescription = '';
      if (err.response.data.errors.username) {
        errorDescription += err.response.data.errors.username;
      } else if (err.response.data.errors.email) {
        errorDescription += err.response.data.errors.email;
      } else if (err.response.data.errors.password) {
        errorDescription += err.response.data.errors.password;
      } else if (err.response.data.errors.role) {
        errorDescription += err.response.data.errors.role;
      } else if (err.response.data.errors.phone_number) {
        errorDescription += err.response.data.errors.phone_number;
      }
      handleToast('Error', errorDescription, 'error');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center text-3xl lg:text-4xl font-semibold mb-6">
        Register With Us
      </h1>
      <div className="flex flex-col border-2 border-[#ce1567] w-80 lg:w-[27rem] px-4 lg:px-8 py-4 lg:py-8 rounded-xl mb-4">
        <form onSubmit={onSubmit}>
          {}
          <div className="flex gap-8">
            <div className="mb-4 lg:mb-6">
              <label className="block mb-2 text-lg">
                Username
              </label>
              <div className="bg-white rounded-md">
                <input
                  type="text"
                  className="w-full p-3 bg-[#ecedf6] border-2 border-transparent focus:border-[#ce1567] rounded-md outline-none"
                  id="username"
                  name="username"
                  ref={usernameRef}
                  placeholder="Name..."
                />
              </div>
            </div>
            <div className="mb-4 lg:mb-6">
              <label className="block mb-2 text-lg">
                Phone
              </label>
              <div className="bg-white rounded-md">
                <input
                  type="text"
                  className="w-full p-3 bg-[#ecedf6] border-2 border-transparent focus:border-[#ce1567] rounded-md outline-none"
                  id="phone_number"
                  name="phone_number"
                  ref={phoneRef}
                  placeholder="Phone..."
                />
              </div>
            </div>
          </div>
          
          {}
          <div className="mb-4 lg:mb-6">
            <label className="block mb-2 text-lg">
              Email
            </label>
            <div className="bg-white rounded-md">
              <input
                type="email"
                className="w-full p-3 bg-[#ecedf6] border-2 border-transparent focus:border-[#ce1567] rounded-md outline-none"
                id="email"
                name="email"
                ref={emailRef}
                placeholder="Email..."
              />
            </div>
          </div>
          
          {}
          <div className="mb-4 lg:mb-6">
            <label className="block mb-2 text-lg">
              Password
            </label>
            <div className="bg-white rounded-md relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full p-3 pr-12 bg-[#ecedf6] border-2 border-transparent focus:border-[#ce1567] rounded-md outline-none"
                id="password"
                name="password"
                ref={passwordRef}
                placeholder="Password..."
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? (
                  <BiHide
                    style={{ width: '20px', height: '20px' }}
                    color="#3d3d3d"
                  />
                ) : (
                  <BiShow
                    style={{ width: '20px', height: '20px' }}
                    color="#3d3d3d"
                  />
                )}
              </button>
            </div>
          </div>
          {}
          <div className="mb-4 lg:mb-6">
            <label className="block mb-2 text-lg">
              Confirm Password
            </label>
            <div className="bg-white rounded-md relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="w-full p-3 pr-12 bg-[#ecedf6] border-2 border-transparent focus:border-[#ce1567] rounded-md outline-none"
                id="confirmPassword"
                name="confirmPassword"
                ref={confirmPasswordRef}
                placeholder="Confirm Password..."
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => {
                  setShowConfirmPassword(!showConfirmPassword);
                }}
              >
                {showConfirmPassword ? (
                  <BiHide
                    style={{ width: '20px', height: '20px' }}
                    color="#3d3d3d"
                  />
                ) : (
                  <BiShow
                    style={{ width: '20px', height: '20px' }}
                    color="#3d3d3d"
                  />
                )}
              </button>
            </div>
          </div>
          <div className="mb-4 lg:mb-6">
            <label className="block mb-2 text-lg">
              Select Role
            </label>
            <div className="bg-white rounded-md">
              <select
                className="w-full p-3 bg-[#ecedf6] border-2 border-transparent focus:border-[#ce1567] rounded-md outline-none"
                id="role"
                name="role"
                ref={roleRef}
              >
                <option value="" disabled selected>
                  Select Role
                </option>
                <option value="launderer">Launderer</option>
                <option value="student">Student</option>
              </select>
            </div>
          </div>
          <div className="flex justify-center">
            {loading ? (
              <button
                className="px-8 py-3 bg-[#ce1567] text-white rounded-md text-base font-medium tracking-wider cursor-not-allowed opacity-50"
                disabled
              >
                Creating Account...
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-3 px-8 py-3 bg-[#ce1567] text-white rounded-md text-base font-medium tracking-wider hover:bg-[#a0114d] transition-colors"
              >
                Create Account
                <HiArrowLongRight color="#ffffff" size="1.5rem" />
              </button>
            )}
          </div>
        </form>
      </div>
      <p className="text-center text-lg lg:text-xl">
        Already have an account?{' '}
        <span
          style={{
            color: '#CE1567',
            fontWeight: 600,
            textDecoration: 'underline',
          }}
        >
          <Link to="/login">Log In</Link>
        </span>
      </p>
    </div>
  );
}
