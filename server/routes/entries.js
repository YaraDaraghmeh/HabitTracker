const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const Habit = require('../models/Habit');
const { protect } = require('../middleware/auth');

// كل الـ routes هون محمية - لازم توكن صحيح
router.use(protect);

// دالة مساعدة: تتأكد إن العادة موجودة وتبعت المستخدم الحالي
async function findOwnedHabit(habitId, userId) {
  return Habit.findOne({ _id: habitId, user: userId });
}

/**
 * @swagger
 * /api/habits/{habitId}/entries:
 *   get:
 *     summary: رجّع كل الأيام المسجلة لعادة معينة (لازم تكون تبعت المستخدم الحالي)
 *     tags: [Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: habitId
 *         required: true
 *         schema:
 *           type: string
 *         description:   (Habit ID)
 *     responses:
 *       200:
 *         description:  array of entries for the specified habit
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Entry'
 *       404:
 *         description: العادة مش موجودة أو مش تبعتك
 *       401:
 *         description: غير مصرح
 */
router.get('/:habitId/entries', async (req, res) => {
  try {
    const habit = await findOwnedHabit(req.params.habitId, req.user._id);
    if (!habit) return res.status(404).json({ message: 'العادة مش موجودة' });

    const entries = await Entry.find({ habit: req.params.habitId }).sort({ date: 1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/habits/{habitId}/entries:
 *   post:
 *     summary: سجل يوم "تم" لعادة معينة (toggle - لو موجود بيتحذف)
 *     tags: [Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: habitId
 *         required: true
 *         schema:
 *           type: string
 *         description:   (Habit ID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EntryInput'
 *     responses:
 *       201:
 *         description: THE day has been registered
 *       200:
 *         description: THE day registration has been cancelled (toggle off)
 *       404:
 *         description: THE habit is not found or not owned by the current user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 */
router.post('/:habitId/entries', async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const habit = await findOwnedHabit(req.params.habitId, req.user._id);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const existing = await Entry.findOne({ habit: req.params.habitId, date });

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
 *     summary: Delete a specific entry for a habit (must belong to the current user)
 *     tags: [Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: habitId
 *         required: true
 *         schema:
 *           type: string
 *         description: معرف العادة (Habit ID)
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         example: "2026-08-14"
 *         description: التاريخ بصيغة YYYY-MM-DD
 *     responses:
 *       200:
 *         description: THE entry has been deleted successfully
 *       404:
 *         description: THE entry or habit is not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 */
router.delete('/:habitId/entries/:date', async (req, res) => {
  try {
    const habit = await findOwnedHabit(req.params.habitId, req.user._id);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const result = await Entry.findOneAndDelete({
      habit: req.params.habitId,
      date: req.params.date,
    });
    if (!result) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;