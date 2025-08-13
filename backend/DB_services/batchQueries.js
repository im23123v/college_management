const Batch = require('../models/batch');

// Create a batch
async function createBatch(batchData) {
  try {
    const batch = new Batch(batchData);
    return await batch.save();
  } catch (err) {
    throw new Error(`Error creating batch: ${err.message}`);
  }
}

// Get all batches
async function getAllBatches() {
  try {
    return await Batch.find();
  } catch (err) {
    throw new Error(`Error fetching batches: ${err.message}`);
  }
}

// Update batch by ID
async function updateBatchById(id, updateData) {
  try {
    return await Batch.findByIdAndUpdate(id, updateData, { new: true });
  } catch (err) {
    throw new Error(`Error updating batch: ${err.message}`);
  }
}

// Delete batch by ID
async function deleteBatchById(id) {
  try {
    return await Batch.findByIdAndDelete(id);
  } catch (err) {
    throw new Error(`Error deleting batch: ${err.message}`);
  }
}

module.exports = {
  createBatch,
  getAllBatches,
  updateBatchById,
  deleteBatchById
};
