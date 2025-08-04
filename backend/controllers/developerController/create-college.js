const { generatePassword } = require('../utils/passwordGenerator');
const { sendEmail } = require('../utils/emailService');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const {
  createCollegeInDB,
  findCollegeByCode,
  getAllColleges,
} = require('../queries/collegeQueries');

exports.createCollege = async (req, res) => {
  const { name, email } = req.body;

  try {
    // Generate college code
    const code = name.substring(0, 3).toUpperCase();

    // Check if code exists
    const existingCollege = await findCollegeByCode(code);
    if (existingCollege) {
      return res.status(400).json({ message: 'College code already exists. Choose a unique college name.' });
    }

    // Generate password
    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create college
    const college = await createCollegeInDB(name, code, email);

    // Create user
    const user = await User.create({
      userId: `admin_${Date.now()}`,
      name: `${name} Admin`,
      email,
      password: hashedPassword,
      role: 'college-admin', // Assuming this is a fixed string and not an ObjectId
      department: null,
    });

    // Send email
    await sendEmail(email, 'Your College Admin Credentials', `
      Your college "${name}" has been registered.

      College Code: ${code}

      Login Credentials:
      ------------------
      UserID: ${email}
      Password: ${plainPassword}

      Please keep this information secure.
    `);

    res.status(201).json({
      message: 'College and admin user created successfully. Credentials sent to email.',
      college,
      adminUser: {
        name: user.name,
        email: user.email,
        userId: user.userId,
        role: 'College Admin'
      }
    });

  } catch (error) {
    console.error('Error creating college:', error);
    res.status(500).json({ error: 'Failed to create college and admin user' });
  }
};


exports.getColleges = async (req, res) => {
  try {
    const colleges = await getAllColleges();
    res.status(200).json(colleges);
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({ error: 'Failed to fetch colleges' });
  }
};
