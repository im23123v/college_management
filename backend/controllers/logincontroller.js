

const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  const { userId, password } = req.body;
  const user = await User.findOne({ userId });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // On success
  return res.status(200).json({
    userId: user.userId,
    name: user.name,
    role: user.role,
    department:user.department,

  });
};
