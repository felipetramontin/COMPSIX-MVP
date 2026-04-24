// routes/sessions.js
const express = require('express');
const router = express.Router();
const { Session } = require('../database/setup');
const auth = require('../middleware/auth');
const role = require('../middleware/roles');

// GET all sessions (trainer/admin)
router.get('/', auth, role('trainer', 'admin'), async (req, res, next) => {
    try {
        const sessions = await Session.findAll();
        res.json(sessions);
    } catch (err) {
        next(err);
    }
});

// GET session by ID
router.get('/:id', auth, async (req, res, next) => {
    try {
        const session = await Session.findByPk(req.params.id);
        if (!session) return res.status(404).json({ error: 'Session not found' });

        if (req.user.role === 'client' && req.user.id !== session.user_id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        res.json(session);
    } catch (err) {
        next(err);
    }
});

// CREATE session
router.post('/', auth, async (req, res, next) => {
    try {
        const { user_id } = req.body;

        if (req.user.role === 'client' && req.user.id !== user_id) {
            return res.status(403).json({ error: 'Clients can only create their own sessions' });
        }

        const session = await Session.create(req.body);
        res.status(201).json(session);
    } catch (err) {
        next(err);
    }
});

// UPDATE session
router.put('/:id', auth, async (req, res, next) => {
    try {
        const session = await Session.findByPk(req.params.id);
        if (!session) return res.status(404).json({ error: 'Session not found' });

        if (req.user.role === 'client' && req.user.id !== session.user_id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        await session.update(req.body);
        res.json(session);
    } catch (err) {
        next(err);
    }
});

// DELETE session
router.delete('/:id', auth, async (req, res, next) => {
    try {
        const session = await Session.findByPk(req.params.id);
        if (!session) return res.status(404).json({ error: 'Session not found' });

        if (req.user.role === 'client' && req.user.id !== session.user_id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        await session.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

module.exports = router;
