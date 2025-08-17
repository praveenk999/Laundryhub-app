import { motion } from 'framer-motion';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Landing from '../../../public/assets/laundry_hero.png';
import useAuthStore from '../Store/AuthStore';
import { toast } from '../../utils/toast';

const AnimatedDiv = motion.div;

function Hero() {
  const navigate = useNavigate();
  const { isAuth, userRole } = useAuthStore((state) => ({
    isAuth: state.isAuth,
    userRole: state.userRole,
  }));

  const contentVariant = {
    initial: { opacity: 0, transform: 'translateX(-50px)' },
    animate: { opacity: 1, transform: 'translateX(0)' },
    transition: { duration: 0.9, ease: 'easeInOut' },
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center gap-8 xl:gap-8 2xl:gap-32 flex-col lg:flex-row px-4 mx-4"
      style={{
        backgroundImage: "url('public/assets/laundry_hero.png')",
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <AnimatedDiv
        variants={contentVariant}
        animate="animate"
        initial="initial"
      >
        <div className="max-w-[32rem] min-w-auto md:min-w-[29rem] flex flex-col items-center justify-center order-1 md:order-0">
          <h1 className="text-lx-purple mb-8 text-center text-[2.1rem] sm:text-[2.5rem] 2xl:text-[3.2rem] font-bold leading-tight">
            Laundry and Dry Cleaning, Done.
          </h1>
          <p className="font-semibold text-base sm:text-xl 2xl:text-[1.3rem] text-center w-80 sm:w-[25rem] md:w-[28rem] 2xl:w-[35rem] mb-8">
            LaundryHub picks up, cleans and delivers. Amazingly awesome,
            ridiculously simple.
          </p>

          {userRole === 'student' ? (
            <button
              className="px-6 mt-2 py-3 bg-lx-purple text-xl font-semibold text-white rounded-lg hover:bg-[#4c4196] active:bg-[#3f3680] active:scale-[0.98] transition-all"
              onClick={() => {
                if (isAuth) {
                  navigate('/OrderList');
                } else {
                  toast.show({
                    title: 'Please login to place an order',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'top',
                  });
                  navigate('/login');
                }
              }}
            >
              Place Order
            </button>
          ) : (
            <button
              className="px-6 mt-2 py-3 bg-lx-purple text-xl font-semibold text-white rounded-lg hover:bg-[#4c4196] active:bg-[#3f3680] active:scale-[0.98] transition-all w-auto"
              onClick={() => {
                if (isAuth) {
                  navigate('/dashboard');
                } else {
                  toast.show({
                    title: 'Login required',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'top',
                  });
                  navigate('/login');
                }
              }}
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </AnimatedDiv>
      <div>
        <img
          src={Landing}
          alt="Laundry Hero"
          className="h-0 xl:h-[530px] 2xl:h-[600px] w-0 xl:w-[700px] 2xl:w-[850px]"
        />
      </div>
    </div>
  );
}

export default Hero;
