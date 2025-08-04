const roleQueries = require('../../DB_services/roleQueries');

exports.createRole = async (req, res) => {
  try {
    const { name, canAddRoles = [], canViewRoles = [], canDeleteRoles = [] } = req.body;

    const existing = await roleQueries.findRoleByName(name);
    if (existing) return res.status(400).json({ message: 'Role already exists' });

    const role = await roleQueries.createRole({ name, canAddRoles, canViewRoles, canDeleteRoles });
    res.status(201).json({ message: 'Role created successfully', role });
  } catch (err) {
    console.error('Error creating role:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await roleQueries.getAllRoles();
    res.json(roles);
  } catch (err) {
    console.error('Error fetching roles:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};