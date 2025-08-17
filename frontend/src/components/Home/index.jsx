import React from 'react';
import ContactSection from './Contact';
import Hero from './Hero';
import ServiceCard from './ServiceCard';
import WorkingCard from './WorkingCard';

function Main() {
  return (
    <div className="pt-16">
      <div className="flex justify-center items-center h-screen">
        <Hero />
      </div>
      <div className="h-screen">
        <ServiceCard />
      </div>
      <div className="h-screen">
        <WorkingCard />
      </div>
      <div className="flex justify-center items-center h-screen">
        <ContactSection />
      </div>
    </div>
  );
}

export default Main;
