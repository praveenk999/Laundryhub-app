// ScrollTest.jsx - Test component to verify scrolling behavior
import React from 'react';
import { Box, VStack, Text, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const ScrollTest = () => {
  // Generate test data
  const testOrders = Array.from({ length: 50 }, (_, i) => ({
    id: `order_${i + 1}`,
    total: Math.floor(Math.random() * 500) + 100,
    date: `2025-01-${(i % 30) + 1}`,
    items: Math.floor(Math.random() * 10) + 1,
    status: i % 2 === 0 ? 'Accepted' : 'Pending'
  }));

  return (
    <VStack align="start" gap={4} ml="8rem" h="100vh" overflow="hidden">
      <Text fontSize="2rem" fontWeight="bold">
        Scroll Test - 50 Orders
      </Text>
      
      <Box
        w="75vw"
        h="calc(100vh - 200px)"
        overflowX="auto"
        overflowY="auto"
        border="2px solid #e2e8f0"
        borderRadius="md"
        css={{
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        <Table variant="simple" size="sm">
          <Thead position="sticky" top={0} bg="white" zIndex={1}>
            <Tr>
              <Th>Order ID</Th>
              <Th>Total</Th>
              <Th>Date</Th>
              <Th>Items</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {testOrders.map((order) => (
              <Tr key={order.id}>
                <Td>{order.id}</Td>
                <Td>₹{order.total}</Td>
                <Td>{order.date}</Td>
                <Td>{order.items}</Td>
                <Td>{order.status}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      
      <Text fontSize="sm" color="gray.500">
        ✅ If you can scroll through all 50 orders, scrolling is working!
      </Text>
    </VStack>
  );
};

export default ScrollTest;
