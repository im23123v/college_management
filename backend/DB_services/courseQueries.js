const Course = require('../models/course.model');

exports.createCourse = async (courseData) => {
  return await Course.create(courseData);
};

exports.getCoursesByDepartment = async (departmentId) => {
  return await Course.find({ departmentId });
};

exports.getAllCourses = async () => {
  return await Course.find({});
};

