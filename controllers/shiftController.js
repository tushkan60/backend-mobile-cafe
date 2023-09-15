const Shift = require('../models/shiftModel');
const Waiter = require('../models/waiterModel');
const Order = require('../models/orderModel');
const Dish = require('../models/dishModel');
const factory = require('./handlersFactory');

exports.openShift = async (req, res) => {
  try {
    const { waiterId, startTime } = req.body;
    const waiter = await Waiter.findById(waiterId);

    if (!waiter) {
      return res.status(404).json({
        status: 'fail',
        message: `Официант с ID ${waiterId} не найден`,
      });
    }

    if (!waiter.inShift) {
      const shift = await Shift.create({
        waiterId,
        startTime,
        isOpen: true,
      });

      waiter.shifts.push(shift._id);
      waiter.inShift = true;
      await waiter.save();

      res.status(201).json({
        status: 'success',
        data: { shift },
      });
    } else {
      return res.status(404).json({
        status: 'fail',
        message: `Официант с ID ${waiterId} уже в смене`,
      });
    }
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.closeShift = async (req, res) => {
  try {
    const shiftId = req.params.id;
    const { waiterId, endTime } = req.body;
    const currentShift = await Shift.findOneAndUpdate(
      { _id: shiftId, isOpen: true },
      { endTime, isOpen: false },
    );
    if (!currentShift) {
      return res.status(404).json({
        status: 'fail',
        message: 'Текущая смена не найдена',
      });
    }

    const waiter = await Waiter.findById(waiterId);
    if (!waiter) {
      return res.status(404).json({
        status: 'fail',
        message: `Официант с ID ${waiterId} не найден`,
      });
    }

    waiter.inShift = false;
    await waiter.save();

    res.status(200).json({
      status: 'success',
      data: { shift: currentShift },
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.getAllShifts = async (req, res) => {
  try {
    const shifts = await Shift.find();

    res.status(200).json({
      status: 'success',
      result: shifts.length,
      data: { shifts },
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.getShift = async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: { shift },
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.getStatistic = async (req, res) => {
  try {
    const date = new Date();
    const startTime = new Date(date);
    const endTime = new Date(date);
    startTime.setUTCHours(0, 0, 1);
    endTime.setUTCHours(23, 59, 59);
    const shifts = await Shift.find();

    const filteredShifts = shifts.filter((shift) => {
      const shiftStartTime = new Date(shift.startTime);
      return shiftStartTime >= startTime && shiftStartTime <= endTime;
    });

    const filteredOrders = filteredShifts.reduce(
      (acc, shift) => [...acc, ...shift.orders],
      [],
    );
    const filteredOrdersResult = await Order.find({
      _id: { $in: filteredOrders },
    });

    const soldDishes = filteredOrdersResult.flatMap((order) => order.dishes);

    const tempQuantityMap = {};

    soldDishes.forEach((dish) => {
      const { dish: dishId, quantity } = dish;
      if (tempQuantityMap[dishId]) {
        tempQuantityMap[dishId] += quantity;
      } else {
        tempQuantityMap[dishId] = quantity;
      }
    });

    const combinedDishes = Object.keys(tempQuantityMap).map((dishId) => ({
      dish: dishId,
      quantity: tempQuantityMap[dishId],
    }));

    combinedDishes.sort((a, b) => b.quantity - a.quantity);

    const top5Dishes = combinedDishes.slice(0, 5);

    const dayTotalOrders = filteredShifts.reduce(
      (acc, shift) => acc + shift.totalOrders,
      0,
    );
    const dayTotalRevenue = +filteredShifts
      .reduce((acc, shift) => acc + shift.totalRevenue, 0)
      .toFixed(2);
    const dayTotalTips = +filteredShifts
      .reduce((acc, shift) => acc + shift.totalTips, 0)
      .toFixed(2);

    const waiterData = {};

    filteredShifts.forEach((shift) => {
      const { waiterId, totalOrders, totalRevenue, totalTips } = shift;
      if (!waiterData[waiterId]) {
        waiterData[waiterId] = {
          _id: waiterId,
          totalOrders: totalOrders,
          totalRevenue: totalRevenue,
          totalTips: totalTips,
        };
      } else {
        waiterData[waiterId].totalOrders += totalOrders;
        waiterData[waiterId].totalRevenue += totalRevenue;
        waiterData[waiterId].totalTips += totalTips;
      }
    });

    const waiters = Object.values(waiterData);

    waiters.forEach((waiter) => {
      const efficiency = (waiter.totalRevenue / dayTotalRevenue) * 100;
      waiter.efficiency = `${efficiency.toFixed(2)}%`;
      waiter.dayWaiterTips = ((dayTotalTips * efficiency) / 100).toFixed(2);
    });

    res.status(200).json({
      status: 'success',
      data: {
        dayTotalOrders,
        dayTotalRevenue,
        dayTotalTips,
        waiters,
        top5Dishes,
      },
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.deleteShift = factory.deleteOne(Shift);

exports.updateShift = factory.updateOne(Shift);
