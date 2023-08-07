const express = require('express');
const morgan = require('morgan');
const waitersRouter = require('./routes/waiterRoutes');
const tablesRouter = require('./routes/tableRoures');
const ordersRouter = require('./routes/orderRoutes');
const shiftsRouter = require('./routes/shiftRoutes');
const dishesRouter = require('./routes/dishRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

function allowCORS(req, res, next) {
  if (process.env.NODE_ENV === 'development') {
    const allowedOrigins = ['http://localhost:4200'];
    const { origin } = req.headers;
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE',
      );
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
  }
  next();
}
app.use(allowCORS);

app.use('/api/v1/waiters', waitersRouter);
app.use('/api/v1/tables', tablesRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/shifts', shiftsRouter);
app.use('/api/v1/dishes', dishesRouter);

module.exports = app;
