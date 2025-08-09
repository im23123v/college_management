const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  adminEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  userId: {
    type: String,        // assuming userId is a string like "admin123"
    required: true,
    unique: true,        // assuming each college has unique userId for admin
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('College', collegeSchema);
