const Role = require('../models/role');


exports.createRole = async (roleData) => {
  const newRole = new Role(roleData);
  return await newRole.save();
};


const getAllRolesByCollege = async (collegeCode) => {
  return await Role.find({ collegeCode }).select('name');
};


;

exports.getRoleByCollegeAndName = async (collegeCode, roleName) => {
  return await Role.findOne({ collegeCode, name: roleName }).select('_id name');
};

;



exports.updateRoleById = async (id, updatedData) => {
  return await Role.findByIdAndUpdate(id, updatedData, { new: true });
};


exports.deleteRoleById = async (id) => {
  return await Role.findByIdAndDelete(id);
};