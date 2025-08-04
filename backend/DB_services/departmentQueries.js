const Department = require('../models/department');

exports.findDepartmentByCode = async (code) => {
  return await Department.findOne({ code });
};

exports.createDepartment = async (deptData) => {
  const newDept = new Department(deptData);
  return await newDept.save();
};

exports.getAllDepartments = async () => {
  return await Department.find().sort({ name: 1 });
};


