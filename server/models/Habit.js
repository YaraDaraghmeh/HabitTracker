const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Habit name is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Habit', habitSchema);
