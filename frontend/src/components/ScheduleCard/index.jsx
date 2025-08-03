import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Select,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { FaTruckPickup, FaUser } from 'react-icons/fa';
import { FaLocationCrosshairs, FaLocationDot } from 'react-icons/fa6';
import { TbTruckDelivery } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../Store/AuthStore';
import useOrderStore from '../Store/OrderStore';
import { createOrder, fetchLaunderers, postNotif } from '../../utils/apis';

function ScheduleCard() {
  const {
    clearSchedule,
    order,
    setPickupDate,
    setPickupTime,
    setDeliveryTime,
    setPickupAddress,
    setDeliveryAddress,
    setLaunderer,
    clearItems,
  } = useOrderStore((state) => ({
    clearSchedule: state.clearSchedule,
    order: state.order,
    setPickupDate: state.setPickupDate,
    setPickupTime: state.setPickupTime,
    setDeliveryTime: state.setDeliveryTime,
    setPickupAddress: state.setPickupAddress,
    setDeliveryAddress: state.setDeliveryAddress,
    setLaunderer: state.setLaunderer,
    clearItems: state.clearItems,
  }));
  const { userName, userHostel, userRollNumber } = useAuthStore((state) => ({
    userName: state.userName,
    userHostel: state.userHostel,
    userRollNumber: state.userRollNumber,
  }));
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);

  const pickupDateRef = useRef();
  const pickupTimeRef = useRef();
  const deliveryTimeRef = useRef();
  const pickupAddressRef = useRef();
  const deliveryAddressRef = useRef();
  const laundererRef = useRef();
  const launderersRef = useRef();

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getLaunderers = async () => {
      try {
        const response = await fetchLaunderers();
        launderersRef.current = response.data;
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    getLaunderers();
  }, []);

  const handleToast = (title, description, status) => {
    toast({
      position: 'top',
      title,
      description,
      status,
      duration: 2000,
      isClosable: true,
    });
  };

  const handleConfirmSchedule = () => {
    if (
      !pickupDateRef.current.value ||
      !pickupTimeRef.current.value ||
      !deliveryTimeRef.current.value ||
      !pickupAddressRef.current.value ||
      !deliveryAddressRef.current.value ||
      !laundererRef.current.value
    ) {
      handleToast('Please confirm all the details.', '', 'error');
      return;
    }
    setPickupDate(pickupDateRef.current.value);
    setPickupTime(pickupTimeRef.current.value);
    setDeliveryTime(deliveryTimeRef.current.value);
    setPickupAddress(pickupAddressRef.current.value);
    setDeliveryAddress(deliveryAddressRef.current.value);
    setLaunderer(laundererRef.current.value);
    handleToast(
      'All schedule details are added.',
      'Order can now be confirmed and placed.',
      'success'
    );
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (userHostel === '' || userRollNumber === '') {
      handleToast(
        'Incomplete Details',
        'Please complete your profile to place an order.',
        'error'
      );
      return;
    }
    if (
      !order.pickupDate ||
      !order.pickupTime ||
      !order.deliveryTime ||
      !order.pickupAddress ||
      !order.deliveryAddress ||
      !order.launderer
    ) {
      handleToast('Please confirm all schedule details.', '', 'error');
      return;
    }
    const notification = {
      student: userName,
      launderer: order.launderer,
      message: `New order placed by ${userName} of ${userHostel}, roll: ${userRollNumber}`,
      orderId: '',
    };
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await createOrder(order);
      handleToast(
        'Order placed successfully',
        'Wait for launderer to accept your order',
        'success'
      );

      const notifResponse = await postNotif(notification);
      if (notifResponse.status !== 500) {
        console.log(notifResponse);
      }
      clearSchedule();
      clearItems();
      navigate('/Dashboard');
    } catch (err) {
      handleToast('Error', err.response.data.message, 'error');
    }
  };

  return (
    <Stack align="center" gap={6}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        border="2px solid gray"
        boxShadow="0px 0px 20px 0px rgba(0, 0, 0, 0.20)"
        borderRadius="1rem"
        justify="center"
        w={{ base: '20rem', md: '32rem' }}
        py="2rem"
        px={{ base: '2rem', md: '2.5rem' }}
        gap={{ base: 6, md: 8 }}
      >
        <Flex
          direction="column"
          justify="space-between"
          align="start"
          gap={{ base: 4, md: '' }}
        >
          <Flex align="center" gap={2}>
            <FaTruckPickup color="#CE1567" size="25" />
            <Text color="#CE1567" fontWeight={600}>
              Pickup Schedule
            </Text>
          </Flex>
          <Select
            placeholder="Select Date"
            border="2px solid #584BAC"
            w="auto"
            ref={pickupDateRef}
            _hover={{ border: '2px solid #584BAC' }}
            _focus={{ border: '2px solid #584BAC' }}
          >
            <option value={moment().format('ddd, D MMM YYYY')}>
              {moment().format('ddd, D MMM YYYY')}
            </option>
            <option value={moment().add(1, 'days').format('ddd, D MMM YYYY')}>
              {moment().add(1, 'days').format('ddd, D MMM YYYY')}
            </option>
            <option value={moment().add(2, 'days').format('ddd, D MMM YYYY')}>
              {moment().add(2, 'days').format('ddd, D MMM YYYY')}
            </option>
          </Select>
          <Select
            placeholder="Select Time"
            border="2px solid #584BAC"
            w="auto"
            ref={pickupTimeRef}
            _hover={{ border: '2px solid #584BAC' }}
            _focus={{ border: '2px solid #584BAC' }}
          >
            <option value="12:00 PM">12:00 PM</option>
            <option value="04:00 PM">04:00 PM</option>
            <option value="07:00 PM">07:00 PM</option>
          </Select>
        </Flex>
        <Divider
          orientation={{ base: 'horizontal', md: 'vertical' }}
          border="1px solid gray"
          height={{ base: '', md: '9rem' }}
        />
        <Flex
          direction="column"
          justify="space-between"
          align="start"
          gap={{ base: 4, md: '' }}
        >
          <Flex align="center" gap={2}>
            <TbTruckDelivery color="#CE1567" size="25" />
            <Text color="#CE1567" fontWeight={600}>
              Delivery Schedule
            </Text>
          </Flex>
          <Text>{order.deliveryDate}</Text>
          <Select
            placeholder="Select Time"
            border="2px solid #584BAC"
            w="auto"
            ref={deliveryTimeRef}
            _hover={{ border: '2px solid #584BAC' }}
            _focus={{ border: '2px solid #584BAC' }}
          >
            <option value="12:00 PM">12:00 PM</option>
            <option value="04:00 PM">04:00 PM</option>
            <option value="07:00 PM">07:00 PM</option>
          </Select>
        </Flex>
      </Flex>
      <Stack
        border="2px solid gray"
        boxShadow="0px 0px 20px 0px rgba(0, 0, 0, 0.20)"
        borderRadius="1rem"
        w={{ base: '20rem', md: '32rem' }}
        py="2rem"
        px={{ base: '1.5rem', md: '2.5rem' }}
        gap={4}
      >
        <Flex align="center" justify="space-between">
          <HStack gap={2}>
            <Box display={{ base: 'none', md: 'block' }}>
              <FaLocationDot color="#CE1567" size="20" />
            </Box>
            <Text color="#CE1567" fontWeight={600}>
              Pickup Address
            </Text>
          </HStack>
          <Select
            placeholder="Select location"
            border="2px solid #584BAC"
            w={{ base: '11rem', md: 'auto' }}
            ref={pickupAddressRef}
            _hover={{ border: '2px solid #584BAC' }}
            _focus={{ border: '2px solid #584BAC' }}
          >
            <option value="1K">1K</option>
            <option value="1.8K">1.8K</option>
            <option value="LH">LH</option>
            <option value="DASA Hall">DASA Hall</option>
            <option value="Block 1">Block 1</option>
            <option value="Block 2">Block 2</option>
            <option value="Block 3">Block 3</option>
            <option value="Block 4">Block 4</option>
          </Select>
        </Flex>
        <Flex align="center" justify="space-between">
          <HStack gap={2}>
            <Box display={{ base: 'none', md: 'block' }}>
              <FaLocationCrosshairs color="#CE1567" size="20" />
            </Box>
            <Text color="#CE1567" fontWeight={600}>
              Delivery Address
            </Text>
          </HStack>
          <Select
            placeholder="Select location"
            border="2px solid #584BAC"
            w={{ base: '12rem', md: 'auto' }}
            ref={deliveryAddressRef}
            _hover={{ border: '2px solid #584BAC' }}
            _focus={{ border: '2px solid #584BAC' }}
          >
            <option value="1K">1K</option>
            <option value="1.8K">1.8K</option>
            <option value="LH">LH</option>
            <option value="DASA Hall">DASA Hall</option>
            <option value="Block 1">Block 1</option>
            <option value="Block 2">Block 2</option>
            <option value="Block 3">Block 3</option>
            <option value="Block 4">Block 4</option>
          </Select>
        </Flex>
        <Flex align="center" justify="space-between">
          <HStack gap={2}>
            <Box display={{ base: 'none', md: 'block' }}>
              <FaUser color="#CE1567" size="20" />
            </Box>
            <Text color="#CE1567" fontWeight={600}>
              Launderer
            </Text>
          </HStack>
          <Select
            placeholder="Select launderer"
            border="2px solid #584BAC"
            w={{ base: '10rem', md: 'auto' }}
            ref={laundererRef}
            _hover={{ border: '2px solid #584BAC' }}
            _focus={{ border: '2px solid #584BAC' }}
          >
            {launderersRef.current &&
              launderersRef.current.map((launderer) => (
                <option key={launderer._id} value={launderer.username}>
                  {launderer.username}
                </option>
              ))}
          </Select>
        </Flex>
      </Stack>
      <HStack gap={{ base: 4, sm: 6, md: 8 }}>
        <Button
          bg="#CE1567"
          color="#FFFFFF"
          _hover={{ bg: '#bf0055' }}
          onClick={handleConfirmSchedule}
        >
          Confirm Schedule
        </Button>
        <Button
          bg="#CE1567"
          color="#FFFFFF"
          _hover={{ bg: '#bf0055' }}
          onClick={handleConfirmOrder}
        >
          Confirm Order
        </Button>
      </HStack>
    </Stack>
  );
}

export default ScheduleCard;
