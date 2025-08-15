const { generatePassword } = require('../../utils/passwordGenerator');
const sendEmail = require('../../utils/emailService');
const Role=require('../../models/role');
const Department=require('../../models/department');
const bcrypt = require('bcryptjs');
const userQueries = require('../../DB_services/userQueries');
const Course = require('../../models/course');
const College = require('../../models/college');


const {
  createCollegeInDB,
  findCollegeByCode,
  getAllColleges,
} = require('../../DB_services/developerQueries');



function generateRandom(length = 8) {
  return Math.random().toString(36).slice(2, 2 + length);
}

exports.createCollege = async (req, res) => {
  const { collegeName, adminName, email } = req.body;

  try {
    const code = collegeName.substring(0, 3).toUpperCase();

    const existingCollege = await findCollegeByCode(code);
    if (existingCollege) {
      return res.status(400).json({ message: 'College code already exists. Choose a unique college name.' });
    }

    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const userId = generateRandom(6);
   const college = await createCollegeInDB(collegeName, code, userId, email);

    
   
const roleDoc = await Role.findOne({ name: 'college-admin' });
const departmentDoc = await Department.findOne({ name: 'ALL' });

if (!roleDoc || !departmentDoc) {
  return res.status(400).json({ message: 'Role or Department not found' });
}

const role = roleDoc._id;
const department = departmentDoc._id;

    const user = await userQueries.createUser({
      collegeCode:code,
      userId,
      name: adminName,
      email,
      password:plainPassword, 
      role,
      department,
    });

   


    await sendEmail(email, 'Your College Admin Credentials', `
      Your college "${collegeName}" has been registered.

      College Code: ${code}

      Login Credentials:
      ------------------
      Email: ${email}
      UserID: ${userId}
      Password: ${plainPassword}

      You can log in with either Email or UserID.
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



const { getCollegeCodeByAdminEmail } = require('../../DB_services/developerQueries');

exports.getCollegeCode = async (req, res) => {
  try {
    const { adminEmail } = req.query;
    if (!adminEmail) {
      return res.status(400).json({ error: 'adminEmail is required' });
    }

    const code = await getCollegeCodeByAdminEmail(adminEmail);
    if (!code) {
      return res.status(404).json({ error: 'College not found' });
    }

    res.status(200).json({ collegeCode: code });
  } catch (error) {
    console.error('Error fetching college code:', error);
    res.status(500).json({ error: 'Error fetching college code' });
  }
};





exports.getCoursesByAdminEmail = async (adminEmail) => {
  // Step 1: Find the college by admin email
  const college = await College.findOne({ adminEmail: adminEmail.toLowerCase().trim() });
  if (!college) {
    return [];
  }

  // Step 2: Find all courses with that college code
  return await Course.find({ collegeCode: college.code }).populate('departmentId');
};
