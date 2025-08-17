import React from 'react';
import { motion } from 'framer-motion';
import Services from '../../TempData/Services';
import Service from './Service';

const cardVariant = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.9, ease: 'easeInOut' },
};

function ServiceCard() {
  const tasks = Services.map((task) => {
    return <Service key={task.id} task={task} />;
  });

  return (
    <>
      <div className="pt-32 md:pt-8 pb-8 md:pb-16 mx-4">
        <div className="pt-24">
          <motion.div
            variants={cardVariant}
            animate="animate"
            initial="initial"
          >
            <h2 className="text-4xl text-center font-semibold">
              What We Offer
            </h2>
            <p className="text-center font-semibold text-xl text-lx-purple">
              Our services and prices
            </p>
          </motion.div>
        </div>
      </div>
      <motion.div variants={cardVariant} animate="animate" initial="initial">
        <div className="flex flex-col lg:flex-row items-center gap-14 justify-center px-0 md:px-36 my-4 md:my-0">
          {tasks}
        </div>
      </motion.div>
    </>
  );
}

export default ServiceCard;
