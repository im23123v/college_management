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
