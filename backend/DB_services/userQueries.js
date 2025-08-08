const User = require('../models/User');

exports.findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

exports.createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

exports.getAllUsers = async () => {
  return await User.find().populate('role').populate('department');
};

exports.deleteUserById = async (id) => {
  return await User.findByIdAndDelete(id);
};

exports.updateUserById = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};
