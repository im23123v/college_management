const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userQueries = require('../DB_services/userQueries');
const College = require('../models/college');

const loginUser = async (req, res) => {
  const { identifier, password } = req.body; // identifier can be email or userId

  try {
    // Find user by email or userId
    const user = await userQueries.findUserByIdentifier(identifier);

    if (!user) {
      return res.status(400).json({ msg: 'Invalid email/userId or password' });
    }

    // Compare password (plain text — if hashed, use bcrypt.compare)
    if (password !== user.password) {
      return res.status(400).json({ msg: 'Invalid email/userId or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

   
    let collegeCode = null;
    let college = null;

    if (identifier.includes('@')) {
      
      college = await College.findOne({ adminEmail: identifier.toLowerCase().trim() }).select('code');
    } else {
      
      college = await College.findOne({ userId: identifier.trim() }).select('code');
    }

    if (college) {
      collegeCode = college.code;
    }

    res.json({
      token,
      user,
      identifier,
      collegeCode 
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Login failed' });
  }
};

module.exports = { loginUser };
