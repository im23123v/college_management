const {
  createLeaveType,
  getAllLeaveTypes,
  getLeaveTypesByRole
} = require('../queries/leaveQueries');

// Create a leave type
exports.addLeaveType = async (req, res) => {
  try {
    const leave = await createLeaveType(req.body);
    res.status(201).json({ message: 'Leave type created', leave });
  } catch (err) {
    console.error('Error creating leave type:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all leave types
exports.getLeaveTypes = async (req, res) => {
  try {
    const leaves = await getAllLeaveTypes();
    res.status(200).json(leaves);
  } catch (err) {
    console.error('Error fetching leave types:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Optional: Get leave types by role
exports.getLeaveTypesByRole = async (req, res) => {
  try {
    const role = req.params.role;
    const leaves = await getLeaveTypesByRole(role);
    res.status(200).json(leaves);
  } catch (err) {
    console.error('Error fetching leave types by role:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
