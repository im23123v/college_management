const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  canAddRoles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  }],
  canViewRoles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  }],
  canDeleteRoles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  }],
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
