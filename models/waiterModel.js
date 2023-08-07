const mongoose = require('mongoose').default;

const waiterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  efficiency: {
    type: Number,
    default: 0,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  inShift: {
    type: Boolean,
    default: false,
  },
  shifts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Shift',
    default: [],
  },
  openOrders: {
    type: Number,
    default: 0,
  },
});

const Waiter = mongoose.model('Waiter', waiterSchema);

module.exports = Waiter;
