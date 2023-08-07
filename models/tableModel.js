const mongoose = require('mongoose').default;

const tableSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    unique: true,
  },
  isOccupied: {
    type: Boolean,
    default: false,
  },
  defaultWaiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Waiter',
    required: true,
  },
});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
