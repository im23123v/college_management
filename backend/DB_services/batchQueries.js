const Batch = require('../models/batch');

exports.createBatch = async (batchData) => {
  const batch = new Batch(batchData);
  return await batch.save();
};

exports.getAllBatches = async () => {
  return await Batch.find();
};

exports.getBatchById = async (id) => {
  return await Batch.findById(id);
};

exports.updateBatch = async (id, updateData) => {
  return await Batch.findByIdAndUpdate(id, updateData, { new: true });
};

exports.deleteBatch = async (id) => {
  return await Batch.findByIdAndDelete(id);
};
