const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');
const authUtils = require('../utils/authUtils');

const maxAge = 86400; 




const getAllUsers = async (req, resp) => {
  try {

    const result = await User.find();
    resp.status(200).json(result);
  } catch (err) {
    resp.status(500).json('UserModel error');
  }
};





const getAllLaunderers = async (req, resp) => {
  try {
    
    const launderers = await User.find({ role: 'launderer' });
    console.log(`✅ Found ${launderers.length} launderers`.green);
    resp.status(200).json(launderers);
  } catch (err) {
    
    resp.status(500).json('UserModel error');
  }
};



const createUser = async (req, resp) => {
  try {
    const { username, email, password, role, phone_number } = req.body;

    const user = new User({
      username,
      email,
      password,
      role,
      phone_number,
    });

    await user.save();
    const token = authUtils.createToken(
      user.username,
      user.role,
      user._id,
      user.hostel
    );
    
    resp.cookie('jwt', token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
    }); 

    resp.status(201).json({
      newUser: user,
      role: user.role,
      email: user.email,
      phone_number: user.phone_number,
    });
  } catch (err) {
    const errors = authUtils.handleSignUpError(err);
    resp.status(500).json({ errors });
  }
};




const updateUser = async (req, resp) => {
  const updates = req.body;
  const token = req.cookies.jwt;
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findByIdAndUpdate(decodedToken.user_id, updates, {
      new: true,
      runValidators: true,
    });
    resp.status(200).json(user);
    if (!user) {
      throw new Error('User not found');
    }
  } catch (err) {
    const errors = authUtils.handleSignUpError(err);
    resp.status(500).json({ errors });
  }
};




const loginUser = async (req, resp) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        const token = authUtils.createToken(
          user.username,
          user.role,
          user._id,
          user.hostel
        );

        resp.cookie('jwt', token, {
          httpOnly: true,
          maxAge: maxAge * 1000,
          secure: process.env.NODE_ENV === 'production', 
          sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
        }); 

        resp.status(200).json({
          username: user.username,
          role: user.role,
          email: user.email,
          phone_number: user.phone_number,
          hostel: user.hostel,
          room_number: user.room_number,
          roll_number: user.roll_number,
        });
      } else {
        throw new Error('Incorrect password!!');
      }
    } else {
      throw new Error('User not found');
    }
  } catch (err) {
    const errors = authUtils.handleLogInError(err);
    resp.status(401).json({ errors });
  }
};




const logoutUser = async (req, resp) => {
  resp.cookie('jwt', '', {
    httpOnly: true,
    maxAge: -1,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
  }); 

  resp.status(200).json({
    message: 'User logged out successfully',
  });
};




const forgotPassword = async (req, resp) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    } else {
      const secret = process.env.JWT_SECRET + user.password;
      const token = jwt.sign(
        {
          email: user.email,
          username: user.username,
          user_id: user._id,
          role: user.role,
          hostel: user.hostel,
        },
        secret,
        { expiresIn: '5m' }
      );
      const url = `http:

      
      const testAccount = await nodemailer.createTestAccount();
      
      const transporter = await nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: process.env.GMAIL_ADDRESS,
          pass: process.env.GMAIL_PASSWORD,
        },
      });

      const info = await transporter.sendMail({
        from: '"LaundryHub" <laundryhub92@gmail.com>',
        to: email,
        subject: 'Reset Password link from LaundryHub',
        text: `Click on this link to reset your password: ${url}`,
        html: `<b>Click on this link to reset your password: <a href="${url}">Reset Password</a></b>`,
      });
      console.log('Message sent: %s', info.messageId);
      resp.status(200).json(info);
    }
  } catch (err) {
    resp.status(404).json({ message: err.message });
  }
};




const getResetPassword = async (req, resp) => {
  const { id, token } = req.params;
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  const secret = process.env.JWT_SECRET + user.password;
  try {
    
    const verify = jwt.verify(token, secret);
    resp.render('index', {
      status: 'not verified',
      error: '',
    });
  } catch (err) {
    resp.status(401).send(err.message);
  }
};




const postResetPassword = async (req, resp) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  if (!password) {
    return resp.status(401).render('index', {
      status: 'not verified',
      error: 'Password cannot be empty',
    });
  }
  if (
    !password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
  ) {
    return resp.status(401).render('index', {
      status: 'not verified',
      error:
        'Password must be at least 8 characters long and must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character',
    });
  }

  const secret = process.env.JWT_SECRET + user.password;
  try {
    
    const verify = jwt.verify(token, secret);
    user.password = password;
    user.save();
    resp.status(200).render('index', { status: 'verified', error: '' });
  } catch (err) {
    alert(err.message);
    resp.status(401).send(err.message);
  }
};
module.exports = {
  getAllUsers,
  getAllLaunderers,
  createUser,
  updateUser,
  loginUser,
  logoutUser,
  forgotPassword,
  getResetPassword,
  postResetPassword,
};
