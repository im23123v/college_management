const {
  createCourse,
  getCoursesByDepartment,
  getAllCourses,
  updateCourseById,
  deleteCourseById,
  getCourseById
} = require('../DB_services/courseQueries');

// Add a new course
exports.addCourse = async (req, res) => {
  try {
    const course = await createCourse(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Error adding course' });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await getAllCourses();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching all courses' });
  }
};

// Get courses by department ID
exports.getCoursesByDept = async (req, res) => {
  try {
    const courses = await getCoursesByDepartment(req.params.departmentId);
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching courses' });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const updated = await updateCourseById(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Course not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error updating course' });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const deleted = await deleteCourseById(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Course not found' });
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting course' });
  }
};

// Optional: Get single course by ID
exports.getCourse = async (req, res) => {
  try {
    const course = await getCourseById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching course' });
  }
};
