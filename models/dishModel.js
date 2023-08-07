const mongoose = require('mongoose').default;

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;
