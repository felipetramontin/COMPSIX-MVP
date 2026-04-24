// routes/workouts.js
const express = require('express');
const router = express.Router();
const { Workout } = require('../database/setup');
const auth = require('../middleware/auth');
const role = require('../middleware/roles');

// GET all workouts
router.get('/', auth, role('trainer', 'admin'), async (req, res, next) => {
    try {
        const workouts = await Workout.findAll();
        res.json(workouts);
    } catch (err) {
        next(err);
    }
});

// GET workout by ID
router.get('/:id', auth, role('trainer', 'admin'), async (req, res, next) => {
    try {
        const workout = await Workout.findByPk(req.params.id);
        if (!workout) return res.status(404).json({ error: 'Workout not found' });
        res.json(workout);
    } catch (err) {
        next(err);
    }
});

// CREATE workout
router.post('/', auth, role('trainer', 'admin'), async (req, res, next) => {
    try {
        const workout = await Workout.create(req.body);
        res.status(201).json(workout);
    } catch (err) {
        next(err);
    }
});

// UPDATE workout
router.put('/:id', auth, role('trainer', 'admin'), async (req, res, next) => {
    try {
        const workout = await Workout.findByPk(req.params.id);
        if (!workout) return res.status(404).json({ error: 'Workout not found' });

        await workout.update(req.body);
        res.json(workout);
    } catch (err) {
        next(err);
    }
});

// DELETE workout
router.delete('/:id', auth, role('trainer', 'admin'), async (req, res, next) => {
    try {
        const workout = await Workout.findByPk(req.params.id);
        if (!workout) return res.status(404).json({ error: 'Workout not found' });

        await workout.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

module.exports = router;
