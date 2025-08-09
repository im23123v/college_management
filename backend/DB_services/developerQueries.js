const College = require('../models/college');



async function getCollegeCodeByIdentifier(identifier) {

  if (!identifier || typeof identifier !== 'string') {
    
    throw new Error('Identifier (userId or email) must be a non-empty string');
  }

  let query;
  if (identifier.includes('@')) {
  
    query = { adminEmail: identifier.toLowerCase().trim() };
  } else {
   
    query = { userId: identifier };
  }

  const college = await College.findOne(query).select('code');
  if (!college) return null;

  return college.code;
}

module.exports = { getCollegeCodeByIdentifier };


exports.createCollegeInDB = async (name, code, adminEmail) => {
  const college = new College({ name, code, adminEmail });
  await college.save();
  return college;
};


exports.findCollegeByCode = async (code) => {
  return await College.findOne({ code });
};


exports.getAllColleges = async () => {
  return await College.find({}, 'name code adminEmail createdAt');
};

