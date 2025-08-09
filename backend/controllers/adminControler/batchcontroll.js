const {
  createBatch,
  getAllBatches,
  updateBatchById,
  deleteBatchById,
} = require('../../DB_services/batchQueries');

// Create Batch
exports.createBatch = async (req, res) => {
  try {
    const batch = await createBatch(req.body);
    res.status(201).json(batch);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create batch', message: err.message });
  }
};

// Get All Batches
exports.getAllBatches = async (req, res) => {
  try {
    const batches = await getAllBatches();
    res.status(200).json(batches);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch batches', message: err.message });
  }
};

// Update Batch by ID
exports.updateBatchById = async (req, res) => {
  try {
    const updatedBatch = await updateBatchById(req.params.id, req.body);
    if (!updatedBatch) return res.status(404).json({ error: 'Batch not found' });
    res.status(200).json(updatedBatch);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update batch', message: err.message });
  }
};

// Delete Batch by ID
exports.deleteBatchById = async (req, res) => {
  try {
    const deleted = await deleteBatchById(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Batch not found' });
    res.status(200).json({ message: 'Batch deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete batch', message: err.message });
  }
};
