import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const cardVariant = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.7, ease: 'easeInOut' },
};

function Working(props) {
  return (
    <div className="flex flex-col px-0 py-0 mx-auto items-center justify-center pb-12">
      <div className="flex justify-center items-center w-full">
        <motion.div variants={cardVariant} animate="animate" initial="initial">
          <div className="w-60 h-60 min-w-60 min-h-60 flex flex-col rounded-3xl bg-white/50 m-4 relative cursor-grab p-4 justify-center items-center">
            <div className="absolute top-0 left-0 min-w-full min-h-full overflow-hidden rounded-3xl bg-white/20">
              <div className="relative w-[85%] h-52 bg-white/20 rounded-full mx-auto mt-8">
                <img
                  src={`assets/${props.procedure.image}`}
                  alt={props.procedure.title}
                  className="w-full pt-2 mx-auto"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <motion.div variants={cardVariant} animate="animate" initial="initial">
        <h3 className="font-semibold text-2xl -mt-2 mb-4">
          {props.procedure.title}
        </h3>
      </motion.div>
      
      <motion.div variants={cardVariant} animate="animate" initial="initial">
        <p className="text-black/60 max-w-60 max-h-8 text-center font-semibold">
          {props.procedure.desc}
        </p>
      </motion.div>
    </div>
  );
}

Working.propTypes = {
  procedure: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    image: PropTypes.string,
    desc: PropTypes.string,
  }),
};
export default Working;
