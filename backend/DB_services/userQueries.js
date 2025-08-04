const User = require('../models/User');

exports.findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

exports.createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};
