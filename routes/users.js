// routes/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { User, Session, Workout, Exercise } = require('../database/setup');
const auth = require('../middleware/auth');
const role = require('../middleware/roles');

// GET all users (admin only)
router.get('/', auth, role('admin'), async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        next(err);
    }
});

// GET user by ID (self or admin)
router.get('/:id', auth, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (req.user.role !== 'admin' && req.user.id !== user.id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        res.json(user);
    } catch (err) {
        next(err);
    }
});

// UPDATE user (self or admin)
router.put('/:id', auth, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (req.user.role !== 'admin' && req.user.id !== user.id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const updates = { ...req.body };

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        await user.update(updates);
        res.json(user);
    } catch (err) {
        next(err);
    }
});

// DELETE user (admin only)
router.delete('/:id', auth, role('admin'), async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        await user.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
});


// ----------------------------
// FITNESS LOGIC ROUTES
// ----------------------------

// GET all workouts for a user
router.get('/:id/workouts', auth, async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);

        if (req.user.role === 'client' && req.user.id !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const sessions = await Session.findAll({
            where: { user_id: userId },
            include: [{ model: Workout, include: [Exercise] }]
        });

        res.json(sessions);
    } catch (err) {
        next(err);
    }
});

// GET PRs for a user
router.get('/:id/prs', auth, async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);

        if (req.user.role === 'client' && req.user.id !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const sessions = await Session.findAll({
            where: { user_id: userId },
            include: [{ model: Workout, include: [Exercise] }]
        });

        const prs = {};

        for (const session of sessions) {
            for (const workout of session.Workouts) {
                const name = workout.Exercise.name;
                const weight = workout.weight || 0;
                const reps = workout.reps || 0;
                const est1RM = weight * (1 + reps / 30);

                if (!prs[name]) {
                    prs[name] = { maxWeight: weight, maxReps: reps, best1RM: est1RM };
                } else {
                    if (weight > prs[name].maxWeight) prs[name].maxWeight = weight;
                    if (reps > prs[name].maxReps) prs[name].maxReps = reps;
                    if (est1RM > prs[name].best1RM) prs[name].best1RM = est1RM;
                }
            }
        }

        res.json(prs);
    } catch (err) {
        next(err);
    }
});

// GET weekly summary
router.get('/:id/summary/weekly', auth, async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);

        if (req.user.role === 'client' && req.user.id !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const sessions = await Session.findAll({
            where: { user_id: userId },
            include: [{ model: Workout, include: [Exercise] }]
        });

        let totalSets = 0;
        let totalReps = 0;
        let totalVolume = 0;
        const muscleGroups = new Set();

        for (const session of sessions) {
            for (const workout of session.Workouts) {
                const sets = workout.sets || 0;
                const reps = workout.reps || 0;
                const weight = workout.weight || 0;

                totalSets += sets;
                totalReps += sets * reps;
                totalVolume += sets * reps * weight;

                if (workout.Exercise?.muscle_group) {
                    muscleGroups.add(workout.Exercise.muscle_group);
                }
            }
        }

        res.json({
            totalSets,
            totalReps,
            totalVolume,
            muscleGroups: Array.from(muscleGroups)
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
