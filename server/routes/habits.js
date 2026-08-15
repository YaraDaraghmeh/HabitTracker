const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const Entry = require('../models/Entry');

/**
 * @swagger
 * /api/habits:
 *   get:
 *     summary:  Retrieve a list of all habits 
 *     tags: [Habits]
 *     responses:
 *       200:
 *         description: A list of habits  
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Habit'
 */
router.get('/', async (req, res) => {
  try {
    const habits = await Habit.find().sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/habits:
 *   post:
 *     summary: Create a new habit  
 *     tags: [Habits]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HabitInput'
 *     responses:
 *       201:
 *         description: the habit created successfully  
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habit'
 *       400:
 *         description:  Invalid input, the habit name is required 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'the habit name is required' });
    }
    const habit = new Habit({ name: name.trim() });
    const savedHabit = await habit.save();
    res.status(201).json(savedHabit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/habits/{id}:
 *   put:
 *     summary: Update a habit by ID   
 *     tags: [Habits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description:  Habit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HabitInput'
 *     responses:
 *       200:
 *         description:   the habit updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habit'
 *       404:
 *         description:   the habit not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const habit = await Habit.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!habit) return res.status(404).json({ message: 'العادة مش موجودة' });
    res.json(habit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/habits/{id}:
 *   delete:
 *     summary: Delete a habit and its entries
 *     tags: [Habits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description:   (Habit ID)
 *     responses:
 *       200:
 *         description: Deleted successfully  
 *       404:
 *         description: the habit not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', async (req, res) => {
  try {
    const habit = await Habit.findByIdAndDelete(req.params.id);
    if (!habit) return res.status(404).json({ message: 'the habit not found' });

    await Entry.deleteMany({ habit: req.params.id });

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;