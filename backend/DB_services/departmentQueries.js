const Department = require('../models/department');

exports.createDepartment = async (data) => {
  return await Department.create(data);
};

exports.getAllDepartments = async () => {
  return await Department.find();
};

exports.findDepartmentByCode = async (code) => {
  return await Department.findOne({ code });
};

exports.updateDepartment = async (id, data) => {
  return await Department.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteDepartment = async (id) => {
  return await Department.findByIdAndDelete(id);
};
