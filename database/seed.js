const { sequelize } = require('../setup');
const User = require('../models/User');
const Session = require('../models/Session');
const Exercise = require('../models/Exercise');
const Workout = require('../models/Workout');

(async () => {
    try {
        await sequelize.sync({ force: true });

        const user = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'hashed-placeholder',
            role: 'client'
        });

        const bench = await Exercise.create({
            name: 'Bench Press',
            muscle_group: 'Chest',
            description: 'Barbell bench press'
        });

        const session = await Session.create({
            user_id: user.id,
            date: '2025-04-01',
            notes: 'Chest day'
        });

        await Workout.create({
            session_id: session.id,
            exercise_id: bench.id,
            sets: 3,
            reps: 10,
            weight: 135
        });

        console.log('Seed complete');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
