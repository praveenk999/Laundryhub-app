import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

function Service(props) {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col px-0 py-0 mx-auto items-center justify-center">
      <div className="flex justify-center items-center w-full">
        <motion.div className="w-60 h-60 min-w-60 min-h-60 flex flex-col rounded-3xl shadow-lg shadow-[#584BAC]/30 bg-white/50 m-4 relative cursor-grab p-4 justify-center items-center">
          <div className="absolute top-0 left-0 min-w-full min-h-full overflow-hidden rounded-3xl bg-[#584bac]/20">
            <div className="relative w-[90%] h-52 bg-[#584bac]/20 rounded-full p-4 mx-auto mt-4">
              <button
                type="button"
                onClick={() => {
                  navigate('/OrderList');
                }}
                className="w-[85%] mx-auto cursor-pointer bg-transparent border-none p-0"
              >
                <img
                  src={`assets/${props.task.image}`}
                  alt={props.task.title}
                  className="w-full"
                />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      
      <h3 className="font-semibold text-2xl text-[#464550]">
        {props.task.title}
      </h3>
    </div>
  );
}
Service.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    image: PropTypes.string,
  }),
};
export default Service;
