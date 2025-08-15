const TimeTable = require('../models/TimeTable');

// Create timetable
exports.createTimeTable = async (req, res) => {
  try {
    const timetable = new TimeTable(req.body);
    await timetable.save();
    res.status(201).json({ message: 'Timetable created successfully', timetable });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get timetable by year/semester
exports.getTimeTable = async (req, res) => {
  try {
    const { collegeCode, departmentId, courseId, batchId, year, semester } = req.query;

    const timetable = await TimeTable.findOne({
      collegeCode,
      departmentId,
      courseId,
      batchId,
      year,
      semester
    })
    .populate('departmentId')
    .populate('courseId')
    .populate('batchId')
    .populate('schedule.slots.subjectId')
    .populate('schedule.slots.teacherId');

    if (!timetable) return res.status(404).json({ message: 'No timetable found' });

    res.json(timetable);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update timetable
exports.updateTimeTable = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await TimeTable.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
