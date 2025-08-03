import React from 'react';
import { motion } from 'framer-motion';
import { Box, Text } from '@chakra-ui/react';
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
    <Box>
      <Box pt={{ base: '8rem', md: '6rem' }} pb={{ base: '2rem', md: '4rem' }}>
        <motion.div variants={cardVariant} animate="animate" initial="initial">
          <Box pt="6rem" mx="1rem">
            <Text fontSize="4xl" textAlign="center" fontWeight="semibold">
              How It Works
            </Text>
            <Text
              textAlign="center"
              fontWeight="semibold"
              fontSize="xl"
              color="lxPurple"
            >
              We collect, clean and deliver you laundry and dry cleaning in 48
              hours
            </Text>
          </Box>
        </motion.div>
      </Box>

      <Box
        display="flex"
        flexDirection={{ base: 'column', lg: 'row' }}
        alignItems="center"
        justifyContent="center"
        gap="3.5rem"
        px={{ base: '0rem', md: '1rem' }}
        my="1rem"
        pb="8rem"
      >
        {procedures}
      </Box>
    </Box>
  );
}

export default WorkingCard;
