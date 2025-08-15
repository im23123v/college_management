const userQueries = require('../../DB_services/userQueries');
const sendEmail = require('../../utils/emailService');
const developer=require('../../DB_services/developerQueries');
const { getRoleByCollegeAndName } = require('../../DB_services/roleQueries');
const { getUsersByRoleIdAndCollege } = require('../../DB_services/userQueries');


function generateRandom(length = 8) {
  return Math.random().toString(36).slice(2, 2 + length);
}

exports.createUser = async (req, res) => {
  try {
    const { identifier,name, email, role, department } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: 'Name, email, and role are required.' });
    }

     const collegeCode=await developer.getCollegeCodeByIdentifier(identifier);

    const existing = await userQueries.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const userId = generateRandom(6);
    const password = generateRandom(8);

    const user = await userQueries.createUser({
      collegeCode,
      userId,
      name,
      email,
      password,
      role,
      department,
    });

    await sendEmail(email, 'Your Account Credentials', `
  Your account has been created successfully.

  Login Credentials:
  ------------------
  name:${name}
  Email: ${email}
  UserID: ${userId}
  Password: ${password}

  You can log in with either Email or UserID.
`);


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
    const searchQuery = req.query.search || null;
    const users = await userQueries.getAllUsers(searchQuery);
    console.log("in the usercontroller:", users);
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




exports.getUsersByRoleAndCollege = async (req, res) => {
  try {
    const { collegeCode, roleName } = req.query;

    if (!collegeCode || !roleName) {
      return res.status(400).json({ message: 'collegeCode and roleName are required' });
    }

    
    const role = await getRoleByCollegeAndName(collegeCode, roleName);
    if (!role) return res.status(404).json({ message: `Role "${roleName}" not found` });

  
    const users = await getUsersByRoleIdAndCollege(role._id, collegeCode);

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
