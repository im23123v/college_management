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


// UPDATE Role
exports.updateRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    const { name, canAddRoles = [], canViewRoles = [], canDeleteRoles = [] } = req.body;

    const updatedRole = await roleQueries.updateRoleById(roleId, {
      name,
      canAddRoles,
      canViewRoles,
      canDeleteRoles,
    });

    if (!updatedRole) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json({ message: 'Role updated successfully', role: updatedRole });
  } catch (err) {
    console.error('Error updating role:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE Role
exports.deleteRole = async (req, res) => {
  try {
    const roleId = req.params.id;

    const deleted = await roleQueries.deleteRoleById(roleId);
    if (!deleted) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    console.error('Error deleting role:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
