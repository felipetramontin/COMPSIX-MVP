const express = require('express');
const router = express.Router();
const { Session } = require('../database/setup');

// GET all sessions
router.get('/', async (req, res) => {
    const sessions = await Session.findAll();
    res.json(sessions);
});

// GET session by ID
router.get('/:id', async (req, res) => {
    const session = await Session.findByPk(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
});

// CREATE session
router.post('/', async (req, res) => {
    try {
        const session = await Session.create(req.body);
        res.status(201).json(session);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// UPDATE session
router.put('/:id', async (req, res) => {
    try {
        const [updated] = await Session.update(req.body, {
            where: { id: req.params.id }
        });
        if (!updated) return res.status(404).json({ error: 'Session not found' });
        res.json({ message: 'Session updated' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE session
router.delete('/:id', async (req, res) => {
    const deleted = await Session.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Session not found' });
    res.json({ message: 'Session deleted' });
});

module.exports = router;
