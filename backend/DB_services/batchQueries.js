const Batch = require('../models/Batch');

exports.createBatch = async (data) => {
  const batch = new Batch(data);
  return await batch.save();
};

exports.getAllBatches = async () => {
  return await Batch.find().sort({ createdAt: -1 });
};

exports.updateBatchById = async (id, data) => {
  return await Batch.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteBatchById = async (id) => {
  return await Batch.findByIdAndDelete(id);
};
