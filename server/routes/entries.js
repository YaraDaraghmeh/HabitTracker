const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const Habit = require('../models/Habit');

/**
 * @swagger
 * /api/habits/{habitId}/entries:
 *   get:
 *     summary:  Retrieve a list of entries for a specific habit
 *     tags: [Entries]
 *     parameters:
 *       - in: path
 *         name: habitId
 *         required: true
 *         schema:
 *           type: string
 *         description:  Habit ID
 *     responses:
 *       200:
 *         description: A list of entries for the specified habit   
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Entry'
 */
router.get('/:habitId/entries', async (req, res) => {
  try {
    const entries = await Entry.find({ habit: req.params.habitId }).sort({
      date: 1,
    });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/habits/{habitId}/entries:
 *   post:
 *     summary: Toggle an entry for a habit by date (create if not exists, delete if exists)
 *     tags: [Entries]
 *     parameters:
 *       - in: path
 *         name: habitId
 *         required: true
 *         schema:
 *           type: string
 *         description:   Habit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EntryInput'
 *     responses:
 *       201:
 *         description: the entry created successfully 
 *       200:
 *         description:   toggle off
 *       404:
 *         description: the habit not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:habitId/entries', async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ message: 'the date is required' });
    }

    const habit = await Habit.findById(req.params.habitId);
    if (!habit) return res.status(404).json({ message: 'the habit not found' });

    const existing = await Entry.findOne({
      habit: req.params.habitId,
      date,
    });

    if (existing) {
      await existing.deleteOne();
      return res.json({ toggled: 'off', date });
    }

    const entry = new Entry({ habit: req.params.habitId, date });
    await entry.save();
    res.status(201).json({ toggled: 'on', entry });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/habits/{habitId}/entries/{date}:
 *   delete:
 *     summary: Delete a specific entry for a habit by date   
 *     tags: [Entries]
 *     parameters:
 *       - in: path
 *         name: habitId
 *         required: true
 *         schema:
 *           type: string
 *         description:   Habit ID
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         example: "2026-08-14"
 *         description:  the date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: the entry not found  
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:habitId/entries/:date', async (req, res) => {
  try {
    const result = await Entry.findOneAndDelete({
      habit: req.params.habitId,
      date: req.params.date,
    });
    if (!result) return res.status(404).json({ message: 'the entry not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;