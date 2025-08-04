const express = require('express');
const router = express.Router();
const developerController = require('../controllers/developerController');

router.post('/colleges', developerController.createCollege);
router.get('/colleges', developerController.getColleges);

module.exports = router;
