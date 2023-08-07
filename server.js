const mongoose = require('mongoose').default;
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

async function main() {
  await mongoose.connect(DB);
}

main()
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => console.log(err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB!');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});
