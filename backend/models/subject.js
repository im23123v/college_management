const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  collegeCode: {
  type: String,
  required: true,
  uppercase: true,
  trim: true,
},
  department: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  subjectName: {
    type: String,
    required: true,
  },
  teacherIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // assuming you store teachers in a User collection
    }
  ]
}, {
  timestamps: true,
});

module.exports = mongoose.model('Subject', subjectSchema);