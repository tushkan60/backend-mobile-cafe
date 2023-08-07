const express = require('express');
const {
  getAllTables,
  getTable,
  createTable,
  updateTable,
  deleteTable,
  updateAllTables,
} = require('../controllers/tableController');

const router = express.Router();

router.route('/').get(getAllTables).patch(updateAllTables).post(createTable);
router.route('/:id').get(getTable).patch(updateTable).delete(deleteTable);

module.exports = router;
