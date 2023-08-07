const express = require('express');
const {
  openShift,
  closeShift,
  getAllShifts,
  getShift,
  getStatistic,
} = require('../controllers/shiftController');

const router = express.Router();

router.route('/').get(getAllShifts).post(openShift);
router.route('/statistics').get(getStatistic);
router.route('/:id').get(getShift).patch(closeShift);
module.exports = router;
