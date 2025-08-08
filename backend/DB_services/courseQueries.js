const Course = require('../models/course');

exports.createCourse = async (courseData) => {
  return await Course.create(courseData);
};

exports.getAllCourses = async () => {
  return await Course.find().populate('departmentId');
};

exports.getCoursesByDepartment = async (deptId) => {
  return await Course.find({ departmentId: deptId });
};

exports.updateCourseById = async (id, updateData) => {
  return await Course.findByIdAndUpdate(id, updateData, { new: true });
};

exports.deleteCourseById = async (id) => {
  return await Course.findByIdAndDelete(id);
};

exports.getCourseById = async (id) => {
  return await Course.findById(id);
};
