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

async function getUsers(search) {
  try {
    let query = {};
    if (search && search.trim() !== "") {
      query = { name: { $regex: search, $options: "i" } }; 
    }
    return await User.find(query);
  } catch (err) {
    throw new Error(err.message);
  }
}

exports.getUsers = getUsers; 

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
