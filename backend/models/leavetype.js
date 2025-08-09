const mongoose = require('mongoose');

const LeaveAllocationSchema = new mongoose.Schema({
  role: { type: String, required: true },
  count: { type: Number, default: 0 },
});

const LeaveTypeSchema = new mongoose.Schema({
    collegeCode: {
  type: String,
  required: true,
  uppercase: true,
  trim: true,
},
  name: { type: String, required: true, unique: true },
  isPaid: { type: Boolean, default: false },
  allocations: [LeaveAllocationSchema],
}, { timestamps: true });

module.exports = mongoose.model('LeaveType', LeaveTypeSchema);
