const userQueries = require('../../DB_services/userQueries');
const { sendCredentialsEmail } = require('../../utils/emailService');

function generateRandom(length = 8) {
  return Math.random().toString(36).slice(2, 2 + length);
}

exports.createUser = async (req, res) => {
  try {
    const { name, email, role, department } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: 'Name, email, and role are required.' });
    }

    const existing = await userQueries.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const userId = generateRandom(6);
    const password = generateRandom(8);

    const user = await userQueries.createUser({
      userId,
      name,
      email,
      password,
      role,
      department,
    });

    await sendCredentialsEmail(email, userId, password);

    res.status(201).json({
      message: 'User created and credentials sent to email',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        userId: user.userId,
      },
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};




exports.getAllUsers = async (req, res) => {
  try {
    const users = await userQueries.getAllUsers();
    console.log("in the usercontroller:",users);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userQueries.deleteUserById(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUser = await userQueries.updateUserById(id, updateData);
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};
