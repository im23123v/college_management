const {
  createLeaveType,
  getAllLeaveTypes,
  getLeaveTypesByRole,
  updateLeaveTypeById,
  deleteLeaveTypeById,
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

// Get leave types by role
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

// Update leave type
exports.updateLeaveType = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateLeaveTypeById(id, req.body);
    if (!updated) return res.status(404).json({ message: 'Leave type not found' });
    res.status(200).json({ message: 'Leave type updated', leave: updated });
  } catch (err) {
    console.error('Error updating leave type:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete leave type
exports.deleteLeaveType = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteLeaveTypeById(id);
    if (!deleted) return res.status(404).json({ message: 'Leave type not found' });
    res.status(200).json({ message: 'Leave type deleted' });
  } catch (err) {
    console.error('Error deleting leave type:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
