const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../DB_services/userQueries');



const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByEmail(email );
    if (!user) return res.status(400).json({ msg: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id },process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ msg: 'Login failed' });
  }
};

module.exports = {
  loginUser,
};
