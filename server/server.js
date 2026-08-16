require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const authRouter = require('./routes/auth');
const habitsRouter = require('./routes/habits');
const entriesRouter = require('./routes/entries');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Docs -> متاحة على /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/habits', habitsRouter);
// entries متداخلة تحت نفس المسار (habits/:habitId/entries)
app.use('/api/habits', entriesRouter);

// Route بسيط للتأكد إن السيرفر شغال
app.get('/', (req, res) => {
  res.json({ message: 'Habit Tracker API is running' });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(' MongoDB connection error:', err.message);
    process.exit(1);
  });