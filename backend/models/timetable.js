const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  startTime: { type: String, required: true }, // "10:00"
  endTime: { type: String, required: true },   // "11:00"
  type: { type: String, enum: ['class', 'break', 'lunch'], default: 'class' },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const dayScheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true
  },
  slots: [timeSlotSchema]
});

const timetableSchema = new mongoose.Schema({
  collegeCode: { type: String, required: true, uppercase: true, trim: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  year: { type: Number, required: true },
  semester: { type: Number, required: true },
  schedule: [dayScheduleSchema]
}, { timestamps: true });

module.exports = mongoose.model('TimeTable', timetableSchema);
