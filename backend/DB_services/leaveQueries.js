const LeaveType = require('../models/LeaveType');

// Create
exports.createLeaveType = async (data) => {
  return await LeaveType.create(data);
};

// Read - All
exports.getAllLeaveTypes = async () => {
  return await LeaveType.find().sort({ createdAt: -1 });
};

// Read - By Role
exports.getLeaveTypesByRole = async (role) => {
  return await LeaveType.find({
    allocations: { $elemMatch: { role } }
  });
};

// Update
exports.updateLeaveTypeById = async (id, updateData) => {
  return await LeaveType.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete
exports.deleteLeaveTypeById = async (id) => {
  return await LeaveType.findByIdAndDelete(id);
};
