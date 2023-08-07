const Dish = require('../models/dishModel');

exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find();

    res.status(200).json({
      status: 'success',
      result: dishes.length,
      data: { dishes },
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.getDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: { dish },
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.createDish = async (req, res) => {
  try {
    const newDish = await Dish.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { dish: newDish },
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.updateDish = async (req, res) => {
  try {
    const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: { dish },
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.deleteDish = async (req, res) => {
  try {
    await Dish.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e,
    });
  }
};
