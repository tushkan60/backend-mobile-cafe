const express = require('express');
const {
  getAllOrders,
  getOrder,
  createOrder,
  closeOrder,
  deleteOrder,
} = require('../controllers/orderController');

const router = express.Router();

router.route('/').get(getAllOrders).post(createOrder);
router.route('/:id').get(getOrder).patch(closeOrder).delete(deleteOrder);

module.exports = router;
