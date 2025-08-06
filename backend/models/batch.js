const mongoose = require('mongoose');

const SemesterSchema = new mongoose.Schema({
  semester: Number,
  from: Date,
  to: Date,
});

const SemesterGroupSchema = new mongoose.Schema({
  year: Number,
  semesters: [SemesterSchema],
});

const BatchSchema = new mongoose.Schema({
  course: { type: String, required: true },
  department: { type: String, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  hasSemester: { type: Boolean, required: true },
  semestersPerYear: { type: Number, required: true },
  semesterData: [SemesterGroupSchema],
}, { timestamps: true });

module.exports = mongoose.model('Batch', BatchSchema);
