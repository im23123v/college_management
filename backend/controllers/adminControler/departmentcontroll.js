const departmentQueries=require('../../DB_services/departmentQueries');

exports.addDepartment = async (req, res) => {
  try {
    const { code, name, description } = req.body;

    if (!code || !name) return res.status(400).json({ message: 'Code and Name are required' });

    const exists = await departmentQueries.findDepartmentByCode(code);
    if (exists) return res.status(409).json({ message: 'Department code already exists' });

    const dept = await departmentQueries.createDepartment({ code, name, description });
    res.status(201).json(dept);
  } catch (err) {
    console.error('Error adding department:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await departmentQueries.getAllDepartments();
    res.json(departments);
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({ message: 'Server error' });
  }
};