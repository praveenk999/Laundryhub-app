import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';
import emailjs from '@emailjs/browser';
import React, { useRef, useState } from 'react';
import { HiArrowLongRight } from 'react-icons/hi2';

function ContactSection() {
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  const senderNameRef = useRef();
  const senderMailRef = useRef();
  const messageRef = useRef();

  const showToastMessage = (title, description, type) => {
    setToastMessage(`${title}: ${description}`);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleClick = () => {
    const senderName = senderNameRef.current.value;
    const senderMail = senderMailRef.current.value;
    const message = messageRef.current.value;

    const newErrors = {};
    if (!senderName) {
      newErrors.senderName = 'Name is required';
    }
    if (!senderMail) {
      newErrors.senderMail = 'Email is required';
    }
    if (!message) {
      newErrors.message = 'Message is required';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const templateParams = {
        from_name: senderName,
        from_email: senderMail,
        to_name: 'LaundryHub',
        message,
      };

      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      emailjs
        .send(serviceId, templateId, templateParams, publicKey)
        .then(() => {
          showToastMessage('Your email has been sent successfully.', '', 'success');
        })
        .catch((error) => {
          showToastMessage('Error sending mail!', error, 'error');
        });
    } else {
      const errorMessages = Object.values(newErrors).join(', ');
      showToastMessage('Cannot send mail!', errorMessages, 'error');
    }
  };

  return (
    <div className="flex items-center gap-8 2xl:gap-12">
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
      
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center gap-4 mb-12">
          <h2 className="text-[#584BAC] font-semibold text-4xl sm:text-5xl 2xl:text-6xl">
            Reach Out to Us
          </h2>
          <p className="font-semibold text-lg sm:text-xl 2xl:text-2xl text-center max-w-xs sm:max-w-lg md:max-w-2xl 2xl:max-w-3xl">
            Whether you have inquiries, feedback, or need support, we're just a
            message away.
          </p>
        </div>
        
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
            <div>
              <label htmlFor="name" className="block text-xl font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                ref={senderNameRef}
                placeholder="Enter your name"
                className="w-80 sm:w-96 md:w-64 2xl:w-72 px-0 py-2 border-0 border-b-2 border-[#584BAC] bg-transparent focus:outline-none focus:border-[#584BAC] hover:border-[#584BAC]"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-xl font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                ref={senderMailRef}
                placeholder="Enter your email"
                className="w-80 sm:w-96 md:w-64 2xl:w-72 px-0 py-2 border-0 border-b-2 border-[#584BAC] bg-transparent focus:outline-none focus:border-[#584BAC] hover:border-[#584BAC]"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="message" className="block text-xl font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              ref={messageRef}
              placeholder="Enter the message"
              rows={4}
              className="w-80 sm:w-96 md:w-full 2xl:w-full px-0 py-2 border-0 border-b-2 border-[#584BAC] bg-transparent resize-none focus:outline-none focus:border-[#584BAC] hover:border-[#584BAC]"
            />
          </div>
        </div>
        
        <button
          onClick={handleClick}
          className="flex items-center gap-3 mt-8 px-8 py-4 bg-[#584BAC] text-white text-xl font-medium rounded-lg hover:bg-[#4c4196] transition-colors duration-300"
        >
          Send Mail
          <HiArrowLongRight size={30} />
        </button>
      </div>
      
      <div className="hidden xl:block w-96 h-96 2xl:w-[45rem] 2xl:h-[45rem]">
        <DotLottiePlayer
          src="/Contact.lottie"
          autoplay
          loop
          playMode="bounce"
          speed={0.75}
        />
      </div>
    </div>
  );
}

export default ContactSection;
