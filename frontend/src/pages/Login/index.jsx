import React from 'react';
import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';

import { Helmet } from 'react-helmet-async';
import LoginForm from '../../components/LoginForm';
import Navbar from '../../components/Navbar';

export default function Login() {
  return (
    <>
      <Helmet>
        <title>LaundryHub - Login</title>
        <meta name="description" content="" />
      </Helmet>
      <Navbar />
      <div className="flex justify-center items-center gap-0 xl:gap-16 2xl:gap-32 h-screen px-0 xl:px-8 2xl:px-0">
        <div className="hidden xl:block h-0 xl:h-[45rem] 2xl:h-[50rem] w-0 xl:w-[45rem] 2xl:w-[50rem]">
          <DotLottiePlayer
            src="/Launderer.lottie"
            autoplay
            loop
            playMode="bounce"
            speed={0.75}
          />
        </div>
        <LoginForm />
      </div>
    </>
  );
}
