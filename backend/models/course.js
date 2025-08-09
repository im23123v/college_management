const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  collegeCode: {
  type: String,
  required: true,
  uppercase: true,
  trim: true,
},
  courseName: { type: String, required: true },
  description: { type: String },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
