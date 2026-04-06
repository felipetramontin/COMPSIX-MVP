const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');

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

// UPDATE workout
router.put('/:id', async (req, res) => {
    try {
        const [updated] = await Workout.update(req.body, {
            where: { id: req.params.id }
        });
        if (!updated) return res.status(404).json({ error: 'Workout not found' });
        res.json({ message: 'Workout updated' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE workout
router.delete('/:id', async (req, res) => {
    const deleted = await Workout.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Workout not found' });
    res.json({ message: 'Workout deleted' });
});

module.exports = router;
