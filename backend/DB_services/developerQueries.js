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

async function createCollegeInDB(name, code, adminEmail) {
  const college = new College({ name, code, adminEmail });
  await college.save();
  return college;
}

async function findCollegeByCode(code) {
  return await College.findOne({ code });
}

async function getAllColleges() {
  return await College.find({}, 'name code adminEmail createdAt');
}

module.exports = {
  getCollegeCodeByIdentifier,
  createCollegeInDB,
  findCollegeByCode,
  getAllColleges
};
