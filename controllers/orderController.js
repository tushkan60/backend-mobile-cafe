const Order = require('../models/orderModel');
const Dish = require('../models/dishModel');
const Shift = require('../models/shiftModel');
const Table = require('../models/tableModel');
const Waiter = require('../models/waiterModel');
const factory = require('./handlersFactory');

async function calculateOrderTotal(dishes) {
  try {
    const dishPromises = dishes.map(async (dishInfo) => {
      const dish = await Dish.findById(dishInfo.dish);
      if (!dish) {
        throw new Error(`Блюдо с ID ${dishInfo.dish} не найдено`);
      }
      return dish.price * dishInfo.quantity;
    });

    const dishTotals = await Promise.all(dishPromises);
    return dishTotals.reduce((sum, dishTotal) => sum + dishTotal, 0);
  } catch (error) {
    console.error('Ошибка при расчете стоимости заказа:', error);
    throw error;
  }
}

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    res.status(200).json({
      status: 'success',
      result: orders.length,
      data: { orders },
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: { order },
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { table, waiterId, dishes, createdAt } = req.body;
    const shift = await Shift.findOne({ waiterId, isOpen: true });
    const occupiedTable = await Table.findById(table);
    const waiter = await Waiter.findById(waiterId);

    if (shift && !occupiedTable.isOccupied && waiter.isAvailable) {
      const totalAmount = await calculateOrderTotal(dishes);
      const newOrder = await Order.create({
        table,
        waiterId,
        dishes,
        totalAmount,
        createdAt,
      });

      occupiedTable.isOccupied = true;
      shift.orders.push(newOrder);
      shift.totalOrders += 1;
      waiter.openOrders += 1;
      waiter.isAvailable = false;
      await occupiedTable.save();
      await waiter.save();
      await shift.save();

      res.status(201).json({
        status: 'success',
        data: { order: newOrder },
      });
    } else {
      return res.status(404).json({
        status: 'fail',
        message: `У официанта с ID ${waiterId} не найдена открытая смена или данный столик занят`,
      });
    }
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.closeOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { isPaid, closedAt } = req.body;
    const order = await Order.findById(orderId);
    const waiter = await Waiter.findById(order.waiterId);

    if (!order || order.isPaid) {
      return res.status(404).json({
        status: 'fail',
        message: `Заказ с ID ${orderId} не найден или уже оплачен`,
      });
    }
    order.closedAt = closedAt;
    order.isPaid = isPaid;

    const minTips = 5;
    const maxTips = 15;
    const randomTips = minTips + Math.random() * (maxTips - minTips);
    order.tipsAmount = ((randomTips / 100) * order.totalAmount).toFixed(2);

    const shift = await Shift.findOne({
      waiterId: order.waiterId,
      isOpen: true,
    });

    if (!shift) {
      return res.status(404).json({
        status: 'fail',
        message: `У официанта с ID ${order.waiterId} не найдена открытая смена`,
      });
    }

    shift.totalRevenue += order.totalAmount;
    shift.totalTips += order.tipsAmount;
    shift.totalRevenue = shift.totalRevenue.toFixed(2);
    shift.totalTips = shift.totalTips.toFixed(2);
    waiter.openOrders -= 1;
    waiter.isAvailable = true;
    const occupiedTable = await Table.findById(order.table);
    occupiedTable.isOccupied = false;
    await occupiedTable.save();
    await order.save();
    await waiter.save();
    await shift.save();
    res.status(200).json({
      status: 'success',
      data: { order },
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.deleteOrder = factory.deleteOne(Order);

exports.updateOrder = factory.updateOne(Order);

// exports.deleteOrder = async (req, res) => {
//   try {
//     await Order.findByIdAndDelete(req.params.id);
//
//     res.status(204).json({
//       status: 'success',
//       data: null,
//     });
//   } catch (e) {
//     res.status(404).json({
//       status: 'fail',
//       message: e,
//     });
//   }
// };
