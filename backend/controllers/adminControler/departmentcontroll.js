const departmentQueries = require('../../DB_services/departmentQueries');
const developer=require('../../DB_services/developerQueries');
exports.addDepartment = async (req, res) => {
  try {
    const { identifier,code, name, description } = req.body;
    if (!code || !name) return res.status(400).json({ message: 'Code and Name are required' });

    const exists = await departmentQueries.findDepartmentByCode(code);
    if (exists) return res.status(409).json({ message: 'Department code already exists' });
     const Collegecode=developer.getCollegeCodeByIdentifier(identifier);
    const dept = await departmentQueries.createDepartment({ Collegecode,code, name, description });
    res.status(201).json(dept);
  } catch (err) {
    console.error('Error adding department:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await departmentQueries.getAllDepartments();
    console.log("in department controll: ",departments);
    res.json(departments);
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const updated = await departmentQueries.updateDepartment(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Department not found' });
    res.json(updated);
  } catch (err) {
    console.error('Error updating department:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const deleted = await departmentQueries.deleteDepartment(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Department not found' });
    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    console.error('Error deleting department:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
