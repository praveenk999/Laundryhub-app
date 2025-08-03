// import {
//   Box,
//   Button,
//   Center,
//   Flex,
//   FormControl,
//   FormLabel,
//   Input,
//   InputGroup,
//   InputRightElement,
//   Modal,
//   ModalBody,
//   ModalCloseButton,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
//   ModalOverlay,
//   Spinner,
//   Stack,
//   Text,
//   useDisclosure,
//   useToast,
// } from '@chakra-ui/react';
// import { useRef, useState } from 'react';
// import { BiHide, BiShow } from 'react-icons/bi';
// import { HiArrowLongRight } from 'react-icons/hi2';
// import { Link, useNavigate } from 'react-router-dom';
// import useAuthStore from '../Store/AuthStore';
// import { login, forgotPassword } from '../../utils/apis';

// export default function LoginForm() {
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const initialRef = useRef();
//   const usernameRef = useRef(null);
//   const passwordRef = useRef(null);

//   const {
//     addAuth,
//     setUserName,
//     setUserRole,
//     setUserEmail,
//     setUserPhone,
//     setUserHostel,
//     setUserRoomNumber,
//     setUserRollNumber,
//   } = useAuthStore((state) => ({
//     addAuth: state.addAuth,
//     setUserName: state.setUserName,
//     setUserRole: state.setUserRole,
//     setUserEmail: state.setUserEmail,
//     setUserPhone: state.setUserPhone,
//     setUserHostel: state.setUserHostel,
//     setUserRoomNumber: state.setUserRoomNumber,
//     setUserRollNumber: state.setUserRollNumber,
//   }));
//   const navigate = useNavigate();
//   const toast = useToast();

//   const handleToast = (title, description, status) => {
//     toast({
//       position: 'top',
//       title,
//       description,
//       status,
//       isClosable: true,
//     });
//   };
//   const onSubmit = async (e) => {
//     e.preventDefault();
//     const credentials = {
//       username: usernameRef.current.value,
//       password: passwordRef.current.value,
//     };

//     if (!(credentials.username && credentials.password)) {
//       handleToast('Incomplete Entries', 'Please fill all the fields', 'error');
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await login(credentials);

//       addAuth();
//       setUserName(credentials.username);
//       setUserRole(response.data.role);
//       setUserEmail(response.data.email);
//       setUserPhone(response.data.phone_number);
//       setUserHostel(response.data.hostel);
//       setUserRoomNumber(response.data.room_number);
//       setUserRollNumber(response.data.roll_number);

//       handleToast('Success', 'Successfully logged in!', 'success');
//       navigate('/');
//       setLoading(false);
//     } catch (err) {
//       setLoading(false);
//       let errorDescription = '';
//       if (err.response.data.errors.username) {
//         errorDescription += err.response.data.errors.username;
//       } else if (err.response.data.errors.password) {
//         errorDescription += err.response.data.errors.password;
//       }
//       handleToast('Error', errorDescription, 'error');
//     }
//   };

//   // Method to handle forgot password
//   const handleForgotPassword = (e) => {
//     e.preventDefault();
//     const email = initialRef.current.value;
//     try {
//       if (email) {
//         // eslint-disable-next-line
//         const response = forgotPassword(email);
//         handleToast(
//           'Success',
//           'Password reset link is sent to your email',
//           'success'
//         );
//       } else {
//         throw new Error('Please enter your email');
//       }
//     } catch (error) {
//       handleToast('Error', error.message, 'error');
//     }
//     onClose();
//   };

//   return (
//     <Stack align="center">
//       <Text textAlign="center" fontSize={['1.7rem', '2.2rem']} fontWeight="600">
//         Log In
//       </Text>
//       <Flex
//         direction="column"
//         border="2px solid #ce1567"
//         w={['20rem', '27rem']}
//         px={['1rem', '2rem']}
//         py={['1rem', '2rem']}
//         borderRadius="0.8rem"
//         mb="1rem"
//       >
//         <form onSubmit={onSubmit}>
//           <Box mb={['1rem', '1.5rem']}>
//             <Text mb="0.5rem" fontSize="1.1rem">
//               Username
//             </Text>
//             <Box bg="#ffffff" borderRadius="0.4rem">
//               <Input
//                 type="text"
//                 focusBorderColor="#ce1567"
//                 bg="#ecedf6"
//                 id="username"
//                 name="username"
//                 ref={usernameRef}
//                 placeholder="Enter your username  ..."
//               />
//             </Box>
//           </Box>
//           <Box mb="1rem">
//             <Text mb="0.5rem" fontSize="1.1rem">
//               Password
//             </Text>
//             <Box bg="#ffffff" borderRadius="0.4rem" mb={1}>
//               <InputGroup>
//                 <Input
//                   type={showPassword ? 'text' : 'password'}
//                   focusBorderColor="#ce1567"
//                   bg="#ecedf6"
//                   id="password"
//                   name="password"
//                   ref={passwordRef}
//                   placeholder="Enter your password..."
//                 />
//                 <InputRightElement
//                   onClick={() => {
//                     setShowPassword(!showPassword);
//                   }}
//                 >
//                   {showPassword ? (
//                     <BiHide
//                       style={{ width: '20px', height: '20px' }}
//                       color="#3d3d3d"
//                     />
//                   ) : (
//                     <BiShow
//                       style={{ width: '20px', height: '20px' }}
//                       color="#3d3d3d"
//                     />
//                   )}
//                 </InputRightElement>
//               </InputGroup>
//             </Box>
//             <Text color="#CE1567" as="u" cursor="pointer" onClick={onOpen}>
//               Forgot Password?
//             </Text>
//             <Modal
//               isOpen={isOpen}
//               onClose={onClose}
//               initialFocusRef={initialRef}
//             >
//               <ModalOverlay />
//               <ModalContent border="2px solid #ce1567" borderRadius="1rem">
//                 <ModalHeader>Forgot Password?</ModalHeader>
//                 <ModalCloseButton />
//                 <ModalBody>
//                   <FormControl>
//                     <FormLabel fontSize="1.1rem">Email Address:</FormLabel>
//                     <Input
//                       type="email"
//                       placeholder="Enter your email"
//                       ref={initialRef}
//                     />
//                   </FormControl>
//                 </ModalBody>

//                 <ModalFooter justifyContent="center">
//                   <Button
//                     bg="#CE1567"
//                     color="#FFFFFF"
//                     _hover={{
//                       bg: '',
//                     }}
//                     onClick={(e) => handleForgotPassword(e)}
//                   >
//                     Send Request
//                   </Button>
//                 </ModalFooter>
//               </ModalContent>
//             </Modal>
//           </Box>
//           <Center>
//             {loading ? (
//               <Spinner />
//             ) : (
//               <Button
//                 type="submit"
//                 mt={['1rem', '']}
//                 px="2rem"
//                 bg="#CE1567"
//                 color="#FFFFFF"
//                 _hover={{
//                   bg: '',
//                 }}
//                 rightIcon={<HiArrowLongRight color="#ffffff" size="1.5rem" />}
//               >
//                 Log In
//               </Button>
//             )}
//           </Center>
//         </form>
//       </Flex>
//       <Text textAlign="center" fontSize={['1.1rem', '1.2rem']}>
//         Don't have an account?{' '}
//         <span
//           style={{
//             color: '#CE1567',
//             fontWeight: 600,
//             textDecoration: 'underline',
//           }}
//         >
//           <Link to="/signup">Register</Link>
//         </span>
//       </Text>
//     </Stack>
//   );
// }


import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { BiHide, BiShow } from 'react-icons/bi';
import { HiArrowLongRight } from 'react-icons/hi2';
import { FaUserTie } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../Store/AuthStore';
import { login, forgotPassword } from '../../utils/apis';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef();
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const {
    addAuth,
    setUserName,
    setUserRole,
    setUserEmail,
    setUserPhone,
    setUserHostel,
    setUserRoomNumber,
    setUserRollNumber,
  } = useAuthStore((state) => ({
    addAuth: state.addAuth,
    setUserName: state.setUserName,
    setUserRole: state.setUserRole,
    setUserEmail: state.setUserEmail,
    setUserPhone: state.setUserPhone,
    setUserHostel: state.setUserHostel,
    setUserRoomNumber: state.setUserRoomNumber,
    setUserRollNumber: state.setUserRollNumber,
  }));

  const navigate = useNavigate();
  const toast = useToast();

  const handleToast = (title, description, status) => {
    toast({
      position: 'top',
      title,
      description,
      status,
      isClosable: true,
    });
  };

  // Function to fill guest credentials
  const handleGuestLogin = () => {
    if (usernameRef.current && passwordRef.current) {
      usernameRef.current.value = 'guest';
      passwordRef.current.value = 'Guest@1234';
      
      handleToast(
        'Guest Credentials Filled', 
        'You can now login with demo credentials', 
        'info'
      );
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const credentials = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    if (!(credentials.username && credentials.password)) {
      handleToast('Incomplete Entries', 'Please fill all the fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await login(credentials);

      addAuth();
      setUserName(credentials.username);
      setUserRole(response.data.role);
      setUserEmail(response.data.email);
      setUserPhone(response.data.phone_number);
      setUserHostel(response.data.hostel);
      setUserRoomNumber(response.data.room_number);
      setUserRollNumber(response.data.roll_number);

      handleToast('Success', 'Successfully logged in!', 'success');
      navigate('/');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      let errorDescription = '';
      if (err.response.data.errors.username) {
        errorDescription += err.response.data.errors.username;
      } else if (err.response.data.errors.password) {
        errorDescription += err.response.data.errors.password;
      }
      handleToast('Error', errorDescription, 'error');
    }
  };

  // Method to handle forgot password
  const handleForgotPassword = (e) => {
    e.preventDefault();
    const email = initialRef.current.value;
    try {
      if (email) {
        // eslint-disable-next-line
        const response = forgotPassword(email);
        handleToast(
          'Success',
          'Password reset link is sent to your email',
          'success'
        );
      } else {
        throw new Error('Please enter your email');
      }
    } catch (error) {
      handleToast('Error', error.message, 'error');
    }
    onClose();
  };

  return (
    <Stack align="center">
      <Text textAlign="center" fontSize={['1.7rem', '2.2rem']} fontWeight="600">
        Log In
      </Text>
      
      {/* Guest Login Banner */}
      {/* <Box
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        borderRadius="lg"
        p={4}
        mb={4}
        w={['20rem', '27rem']}
        color="white"
        textAlign="center"
      >
        <Text fontSize="sm" fontWeight="600" mb={2}>
           Demo for Interviewers
        </Text>
        <Button
          size="sm"
          colorScheme="whiteAlpha"
          variant="solid"
          leftIcon={<FaUserTie />}
          onClick={handleGuestLogin}
          _hover={{ 
            transform: 'translateY(-2px)',
            boxShadow: 'lg'
          }}
          transition="all 0.2s"
        >
          Fill Guest Credentials
        </Button>
        <Text fontSize="xs" mt={2} opacity={0.9}>
          Click to auto-fill demo login details
        </Text>
      </Box> */}
      
      {/* Guest Login Banner */}
      <Box
        bg="#ce1567"
        borderRadius="lg"
        p={4}
        mb={4}
        w={['20rem', '27rem']}
        color="white"
        textAlign="center"
        border="2px solid #b50055"
        boxShadow="0px 4px 15px rgba(206, 21, 103, 0.3)"
      >
        <Text fontSize="sm" fontWeight="600" mb={2}>
           Demo for Interviewers
        </Text>
        <Button
          size="sm"
          bg="white"
          color="#ce1567"
          variant="solid"
          leftIcon={<FaUserTie />}
          onClick={handleGuestLogin}
          _hover={{ 
            bg: "#f8f9fa",
            transform: 'translateY(-2px)',
            boxShadow: 'lg'
          }}
          transition="all 0.2s"
          fontWeight="600"
        >
          Fill Guest Credentials
        </Button>
        <Text fontSize="xs" mt={2} opacity={0.9}>
          Click to auto-fill demo login details
        </Text>
      </Box>

      <Flex
        direction="column"
        border="2px solid #ce1567"
        w={['20rem', '27rem']}
        px={['1rem', '2rem']}
        py={['1rem', '2rem']}
        borderRadius="0.8rem"
        mb="1rem"
      >
        <form onSubmit={onSubmit}>
          <Box mb={['1rem', '1.5rem']}>
            <Text mb="0.5rem" fontSize="1.1rem">
              Username
            </Text>
            <Box bg="#ffffff" borderRadius="0.4rem">
              <Input
                type="text"
                focusBorderColor="#ce1567"
                bg="#ecedf6"
                id="username"
                name="username"
                ref={usernameRef}
                placeholder="Enter your username  ..."
              />
            </Box>
          </Box>
          <Box mb="1rem">
            <Text mb="0.5rem" fontSize="1.1rem">
              Password
            </Text>
            <Box bg="#ffffff" borderRadius="0.4rem" mb={1}>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  focusBorderColor="#ce1567"
                  bg="#ecedf6"
                  id="password"
                  name="password"
                  ref={passwordRef}
                  placeholder="Enter your password..."
                />
                <InputRightElement
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? (
                    <BiHide
                      style={{ width: '20px', height: '20px' }}
                      color="#3d3d3d"
                    />
                  ) : (
                    <BiShow
                      style={{ width: '20px', height: '20px' }}
                      color="#3d3d3d"
                    />
                  )}
                </InputRightElement>
              </InputGroup>
            </Box>
            <Text color="#CE1567" as="u" cursor="pointer" onClick={onOpen}>
              Forgot Password?
            </Text>
            <Modal
              isOpen={isOpen}
              onClose={onClose}
              initialFocusRef={initialRef}
            >
              <ModalOverlay />
              <ModalContent border="2px solid #ce1567" borderRadius="1rem">
                <ModalHeader>Forgot Password?</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl>
                    <FormLabel fontSize="1.1rem">Email Address:</FormLabel>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      ref={initialRef}
                    />
                  </FormControl>
                </ModalBody>

                <ModalFooter justifyContent="center">
                  <Button
                    bg="#CE1567"
                    color="#FFFFFF"
                    _hover={{
                      bg: '',
                    }}
                    onClick={(e) => handleForgotPassword(e)}
                  >
                    Send Request
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
          <Center>
            {loading ? (
              <Spinner />
            ) : (
              <Button
                type="submit"
                letterSpacing={1}
                mt={['1rem', '']}
                px="2rem"
                bg="#CE1567"
                color="#FFFFFF"
                _hover={{
                  bg: '',
                }}
                rightIcon={<HiArrowLongRight color="#ffffff" size="1.5rem" />}
              >
                Log In
              </Button>
            )}
          </Center>
        </form>
      </Flex>

      <Text textAlign="center" fontSize={['1.1rem', '1.2rem']}>
        Don't have an account?{' '}
        <span
          style={{
            color: '#CE1567',
            fontWeight: 600,
            textDecoration: 'underline',
          }}
        >
          <Link to="/signup">Register</Link>
        </span>
      </Text>
    </Stack>
  );
}