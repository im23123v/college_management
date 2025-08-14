// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userQueries = require('../DB_services/userQueries');

const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  try {
  
    
    console.log(identifier);

    const user = await userQueries.findUserByIdentifier(identifier);

   console.log("authcontroller:", user);
    
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email/userId or password' });
    }

    console.log("password:",password);

    console.log("user.passowrd",user.password);

    if (password!==user.password) {
      return res.status(400).json({ msg: 'Invalid email/userId or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user,
      identifier
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Login failed' });
  }
};

module.exports = { loginUser };
