const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  habit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

entrySchema.index({ habit: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Entry', entrySchema);
