const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const Entry = require('../models/Entry');
const { protect } = require('../middleware/auth');

// كل الـ routes هون محمية - لازم توكن صحيح
router.use(protect);

/**
 * @swagger
 * /api/habits:
 *   get:
 *     summary: ّreturn all habits of the current user  
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: array of habits for the current user  
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Habit'
 *       401:
 *         description: Unauthorized
 */
router.get('/', async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/habits:
 *   post:
 *     summary: Create a new habit for the current user
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HabitInput'
 *     responses:
 *       201:
 *         description: THE habit has been created successfully  
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habit'
 *       400:
 *         description: Bad Request - missing or invalid habit name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 */
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Habit name is required' });
    }
    const habit = new Habit({ name: name.trim(), user: req.user._id });
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
 *     summary: Update the habit of the current user
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description:   (Habit ID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HabitInput'
 *     responses:
 *       200:
 *         description:   the habit has been updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habit'
 *       404:
 *         description: العادة مش موجودة أو مش تبعتك
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: غير مصرح
 */
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name },
      { new: true, runValidators: true }
    );
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    res.json(habit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/habits/{id}:
 *   delete:
 *     summary: Delete the habit of the current user and all its entries
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: معرف العادة (Habit ID)
 *     responses:
 *       200:
 *         description: تم الحذف بنجاح
 *       404:
 *         description: العادة مش موجودة أو مش تبعتك
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description:  Unauthorized
 */
router.delete('/:id', async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    await Entry.deleteMany({ habit: req.params.id });

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;