const jwt = require('jsonwebtoken');

const verifyUser = (req, resp, next) => {
  try {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        // eslint-disable-next-line no-unused-vars
        async (err, decodedToken) => {
          if (err) {
            console.error(err);
            resp.status(401).json({ message: 'Unauthorized' });
          } else {
            next();
          }
        }
      );
    } else {
      resp.status(401).json({ message: 'Unauthorized' }); // Return an unauthorized response
    }
  } catch (err) {
    console.error(err);
    resp.status(500).json({ message: 'Internal Server Error' });
  }
};
const verifyStudentDetails = (req, resp, next) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decodedToken.role === 'student' && decodedToken.hostel === '') {
      resp.status(401).json({ message: 'Please update your hostel details' });
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    resp.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  verifyUser,
  verifyStudentDetails,
};
