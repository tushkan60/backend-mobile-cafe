const express = require('express');
const {
  getAllWaiters,
  getWaiter,
  createWaiter,
  updateWaiter,
  deleteWaiter,
} = require('../controllers/waiterController');

const router = express.Router();

router.route('/').get(getAllWaiters).post(createWaiter);
router.route('/:id').get(getWaiter).patch(updateWaiter).delete(deleteWaiter);

module.exports = router;
