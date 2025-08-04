const College = require('../models/College');


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

