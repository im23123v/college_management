const User = require('../models/user');

exports.findUserByEmail = async (email) => {
  return await User.findOne({ email }).populate('role');
};


exports.findUserByIdentifier = async (identifier) => {
  return await User.findOne({
    $or: [
      { email: identifier },
      { userId: identifier }
    ]
  }).populate('role'); 
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
