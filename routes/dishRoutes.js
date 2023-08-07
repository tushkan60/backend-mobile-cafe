const express = require('express');
const {
  getAllDishes,
  getDish,
  createDish,
  updateDish,
  deleteDish,
} = require('../controllers/dishController');

const router = express.Router();

router.route('/').get(getAllDishes).post(createDish);
router.route('/:id').get(getDish).patch(updateDish).delete(deleteDish);

module.exports = router;
