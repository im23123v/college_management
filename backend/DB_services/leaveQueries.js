const LeaveType = require('../../models/LeaveType');

// Add a new leave type
const createLeaveType = async (data) => {
  return await LeaveType.create(data);
};

// Get all leave types
const getAllLeaveTypes = async () => {
  return await LeaveType.find();
};

// Optional: Get leave types by role
const getLeaveTypesByRole = async (roleName) => {
  return await LeaveType.find({ 'allocations.role': roleName });
};

module.exports = {
  createLeaveType,
  getAllLeaveTypes,
  getLeaveTypesByRole,
};
