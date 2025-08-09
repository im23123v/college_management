const subjectQueries = require('../../DB_services/subjectQueries');
const developer =require('../../DB_services/developerQueries')
exports.createSubject = async (req, res) => {
  try {
    const {
      identifier,    // email or userId sent from AsyncStorage
      course,        // selectedCourseId
      year: yearNum, // selectedYear
      semester: semNum, // selectedSemester
      subjectName,
      teacherIds: selectedTeachers,
    } = req.body;

    const Collegecode=developer.getCollegeCodeByIdentifier(identifier);
    
    const subject = await subjectQueries.createSubject({
      Collegecode,    // email or userId sent from AsyncStorage
      course,        // selectedCourseId
      year: yearNum, // selectedYear
      semester: semNum, // selectedSemester
      subjectName,
      teacherIds: selectedTeachers,
    } );
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await subjectQueries.getAllSubjects();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSubjectById = async (req, res) => {
  try {
    const subject = await subjectQueries.getSubjectById(req.params.id);
    res.json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const updated = await subjectQueries.updateSubject(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    await subjectQueries.deleteSubject(req.params.id);
    res.json({ message: 'Subject deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};