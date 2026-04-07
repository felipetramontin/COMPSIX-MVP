const express = require('express');
const router = express.Router();
const { Exercise } = require('../database/setup');

// GET all exercises
router.get('/', async (req, res) => {
    const exercises = await Exercise.findAll();
    res.json(exercises);
});

// GET exercise by ID
router.get('/:id', async (req, res) => {
    const exercise = await Exercise.findByPk(req.params.id);
    if (!exercise) return res.status(404).json({ error: 'Exercise not found' });
    res.json(exercise);
});

// CREATE exercise
router.post('/', async (req, res) => {
    try {
        const exercise = await Exercise.create(req.body);
        res.status(201).json(exercise);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// UPDATE exercise
router.put('/:id', async (req, res) => {
    try {
        const [updated] = await Exercise.update(req.body, {
            where: { id: req.params.id }
        });
        if (!updated) return res.status(404).json({ error: 'Exercise not found' });
        res.json({ message: 'Exercise updated' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE exercise
router.delete('/:id', async (req, res) => {
    const deleted = await Exercise.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Exercise not found' });
    res.json({ message: 'Exercise deleted' });
});

module.exports = router;
