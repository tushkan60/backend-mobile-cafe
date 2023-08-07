const Table = require('../models/tableModel');

exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find();

    res.status(200).json({
      status: 'success',
      result: tables.length,
      data: { tables },
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.getTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: { table },
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.createTable = async (req, res) => {
  try {
    const newTable = await Table.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { table: newTable },
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: { table },
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.updateAllTables = async (req, res) => {
  try {
    const updatedTables = req.body;

    const updatedTablePromises = updatedTables.map(
      async (table) =>
        await Table.findByIdAndUpdate(
          table._id,
          {
            defaultWaiter: table.defaultWaiter,
          },
          {
            new: true,
            runValidators: true,
          },
        ),
    );

    const tables = await Promise.all(updatedTablePromises);

    res.status(200).json({
      status: 'success',
      data: { tables },
    });
  } catch (e) {
    res.status(400).json({
      status: 'fail',
      message: e.message,
    });
  }
};

exports.deleteTable = async (req, res) => {
  try {
    await Table.findByIdAndDelete(req.params.id);

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
