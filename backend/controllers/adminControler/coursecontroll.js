const { createCourse, getCoursesByDepartment } = require('../../DB_services/courseQueries');


exports.addCourse = async (req, res) => {
  try {
    const course = await createCourse(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Error adding course' });
  }
};

exports.getCoursesByDept = async (req, res) => {
  try {
    const courses = await getCoursesByDepartment(req.params.departmentId);
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching courses' });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await getAllCourses();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching all courses' });
  }
};