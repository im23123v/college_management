const User = require('../models/user');

async function findUserByEmail(email) {
  return await User.findOne({ email }).populate('role');
}

async function findUserByIdentifier(identifier) {
  return await User.findOne({
    $or: [
      { email: identifier },
      { userId: identifier }
    ]
  }).populate('role'); 
}

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

async function createUser(userData) {
  const user = new User(userData);
  return await user.save();
}

async function getAllUsers() {
  return await User.find().populate('role').populate('department');
}

async function deleteUserById(id) {
  return await User.findByIdAndDelete(id);
}

async function updateUserById(id, updateData) {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
}

module.exports = {
  findUserByEmail,
  findUserByIdentifier,
  getUsers,
  createUser,
  getAllUsers,
  deleteUserById,
  updateUserById
};
