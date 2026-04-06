const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/sessions', require('./sessions'));
router.use('/exercises', require('./exercises'));
router.use('/workouts', require('./workouts'));

module.exports = router;
