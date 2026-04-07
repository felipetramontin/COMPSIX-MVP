const express = require('express');
const router = express.Router();
const { Workout } = require('../database/setup');

// GET all workouts
router.get('/', async (req, res) => {
    const workouts = await Workout.findAll();
    res.json(workouts);
});

// GET workout by ID
router.get('/:id', async (req, res) => {
    const workout = await Workout.findByPk(req.params.id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    res.json(workout);
});

// CREATE workout
router.post('/', async (req, res) => {
    try {
        const workout = await Workout.create(req.body);
        res.status(201).json(workout);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// UPDATE (return updated object)
router.put('/:id', async (req, res) => {
    try {
        const workout = await Workout.findByPk(req.params.id);
        if (!workout) return res.status(404).json({ error: 'Workout not found' });

        await workout.update(req.body);
        res.json(workout);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE (return 204)
router.delete('/:id', async (req, res) => {
    const workout = await Workout.findByPk(req.params.id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });

    await workout.destroy();
    res.status(204).send();
});

module.exports = router;
