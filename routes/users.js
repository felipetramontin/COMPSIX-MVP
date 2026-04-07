const express = require('express');
const router = express.Router();
const User = require('../database/models/User');

// GET all users
router.get('/', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

// GET user by ID
router.get('/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
});

// CREATE user
router.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// UPDATE user
router.put('/:id', async (req, res) => {
    try {
        const [updated] = await User.update(req.body, {
            where: { id: req.params.id }
        });
        if (!updated) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User updated' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE user
router.delete('/:id', async (req, res) => {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
});

module.exports = router;
