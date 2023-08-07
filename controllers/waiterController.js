const Waiter = require('../models/waiterModel');

exports.getAllWaiters = async (req, res) => {
  try {
    const waiters = await Waiter.find();

    res.status(200).json({
      status: 'success',
      result: waiters.length,
      data: { waiters },
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.getWaiter = async (req, res) => {
  try {
    const waiter = await Waiter.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: { waiter },
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.createWaiter = async (req, res) => {
  try {
    const newWaiter = await Waiter.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { waiter: newWaiter },
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.updateWaiter = async (req, res) => {
  try {
    const waiter = await Waiter.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: { waiter },
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.deleteWaiter = async (req, res) => {
  try {
    await Waiter.findByIdAndDelete(req.params.id);

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
