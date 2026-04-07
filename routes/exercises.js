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

// UPDATE (return updated object)
router.put('/:id', async (req, res) => {
    try {
        const exercise = await Exercise.findByPk(req.params.id);
        if (!exercise) return res.status(404).json({ error: 'Exercise not found' });

        await exercise.update(req.body);
        res.json(exercise);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE (return 204)
router.delete('/:id', async (req, res) => {
    const exercise = await Exercise.findByPk(req.params.id);
    if (!exercise) return res.status(404).json({ error: 'Exercise not found' });

    await exercise.destroy();
    res.status(204).send();
});

module.exports = router;
