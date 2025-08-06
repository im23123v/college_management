const express = require('express');
const router = express.Router();

// Import controllers from separate files
const roleController = require('../controllers/adminControler/rolecontroll');
const userController = require('../controllers/adminControler/usercontroll');
const departmentController = require('../controllers/adminControler/departmentcontroll');
const courseController = require('../controllers/adminControler/coursecontroll');
const leaveController = require('../controllers/adminControler/leavecontroll');
const subjectController = require('../controllers/adminControler/subjectControll');
const batchController = require('../controllers/adminControler/batchcontroll');


// ---- ROLES ----
router.post('/roles', roleController.createRole);
router.get('/roles', roleController.getAllRoles);
router.put('/roles/:id', roleController.updateRole);   // 🆕 for edit
router.delete('/roles/:id', roleController.deleteRole); 

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

// subjects
router.post('/create', subjectController.createSubject);
router.get('/', subjectController.getAllSubjects);
router.get('/:id', subjectController.getSubjectById);
router.put('/:id', subjectController.updateSubject);
router.delete('/:id', subjectController.deleteSubject);


// batch

router.post('/batches', batchController.createBatch);
router.get('/batches', batchController.getAllBatches);
router.get('/batches/:id', batchController.getBatchById);
router.put('/batches/:id', batchController.updateBatch);
router.delete('/batches/:id', batchController.deleteBatch);

module.exports = router;
