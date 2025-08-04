const express = require('express');
const router = express.Router();

// Import controllers from separate files
const roleController = require('../controllers/adminControler/rolecontroll');
const userController = require('../admincontroller/usercontroll');
const departmentController = require('../admincontroller/departmentcontroll');
const courseController = require('../admincontroller/coursecontroll');
const leaveController = require('../admincontroller/leavecontroll');


// ---- ROLES ----
router.post('/roles', roleController.createRole);
router.get('/roles', roleController.getAllRoles);

// ---- USERS ----
router.post('/users', userController.createUser);

// ---- DEPARTMENTS ----
router.post('/departments', departmentController.addDepartment);
router.get('/departments', departmentController.getAllDepartments);

// ---- COURSES ----
router.post('/courses', courseController.addCourse);
router.get('/courses', courseController.getCourses);
router.get('/courses/:code', courseController.getCourse);

// ---- LEAVE TYPES ----
router.post('/leave-types', leaveController.addLeaveType);
router.get('/leave-types', leaveController.getLeaveTypes);
router.get('/leave-types/role/:role', leaveController.getLeaveTypesByRole);

module.exports = router;
