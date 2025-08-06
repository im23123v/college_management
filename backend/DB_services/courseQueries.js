const Course = require('../models/course');

exports.createCourse = async (courseData) => {
  return await Course.create(courseData);
};

exports.getCoursesByDepartment = async (deptId) => {
  return await Course.find({ departmentId: deptId });
};
