const Role = require('../models/role');

exports.findRoleByName = async (name) => {
  return await Role.findOne({ name });
};

exports.createRole = async (roleData) => {
  const newRole = new Role(roleData);
  return await newRole.save();
};

exports.getAllRoles = async () => {
  return await Role.find().select('_id name');
};
