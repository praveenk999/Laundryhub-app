import React from 'react';
import { motion } from 'framer-motion';
import Workings from '../../TempData/Workings';
import Working from './Working';

const cardVariant = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.7, ease: 'easeInOut' },
};

function WorkingCard() {
  const procedures = Workings.map((procedure) => {
    return <Working key={procedure.id} procedure={procedure} />;
  });

  return (
    <div>
      <div className="pt-32 md:pt-24 pb-8 md:pb-16">
        <motion.div variants={cardVariant} animate="animate" initial="initial">
          <div className="pt-24 mx-4">
            <h2 className="text-4xl text-center font-semibold">
              How It Works
            </h2>
            <p className="text-center font-semibold text-xl text-[#584BAC]">
              We collect, clean and deliver you laundry and dry cleaning in 48
              hours
            </p>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-14 px-0 md:px-4 my-4 pb-32">
        {procedures}
      </div>
    </div>
  );
}

export default WorkingCard;
