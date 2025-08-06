const Subject = require('../models/subject');

// Create a new subject
exports.createSubject = async (data) => {
  const subject = new Subject(data);
  return await subject.save();
};

// Get all subjects
exports.getAllSubjects = async () => {
  return await Subject.find().populate('teacherIds', 'name email');
};

// Get subject by ID
exports.getSubjectById = async (id) => {
  return await Subject.findById(id).populate('teacherIds', 'name email');
};

// Update subject
exports.updateSubject = async (id, data) => {
  return await Subject.findByIdAndUpdate(id, data, { new: true });
};

// Delete subject
exports.deleteSubject = async (id) => {
  return await Subject.findByIdAndDelete(id);
};