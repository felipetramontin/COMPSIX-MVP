const bcrypt = require('bcryptjs');
const { User, Session, Exercise, Workout, sequelize } = require('./setup');

async function seedDatabase() {
    try {
        // Reset database
        await sequelize.sync({ force: true });
        console.log('Database reset successfully.');

        // Create sample users
        const hashedPassword = await bcrypt.hash('password123', 10);

        const users = await User.bulkCreate([
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: hashedPassword
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: hashedPassword
            }
        ]);

        console.log('Users created.');

        // Create sample exercises
        const exercises = await Exercise.bulkCreate([
            {
                name: 'Bench Press',
                muscle_group: 'Chest',
                description: 'Barbell bench press'
            },
            {
                name: 'Squat',
                muscle_group: 'Legs',
                description: 'Barbell back squat'
            },
            {
                name: 'Deadlift',
                muscle_group: 'Back',
                description: 'Conventional barbell deadlift'
            }
        ]);

        console.log('Exercises created.');

        // Create sample sessions
        const sessions = await Session.bulkCreate([
            {
                user_id: users[0].id,
                date: '2025-04-01',
                notes: 'Strength training day'
            },
            {
                user_id: users[1].id,
                date: '2025-04-02',
                notes: 'Leg day'
            }
        ]);

        console.log('Sessions created.');

        // Create sample workouts (exercise performed inside a session)
        await Workout.bulkCreate([
            // John's session
            {
                session_id: sessions[0].id,
                exercise_id: exercises[0].id, // Bench
                sets: 3,
                reps: 8,
                weight: 185
            },
            {
                session_id: sessions[0].id,
                exercise_id: exercises[2].id, // Deadlift
                sets: 3,
                reps: 5,
                weight: 275
            },

            // Jane's session
            {
                session_id: sessions[1].id,
                exercise_id: exercises[1].id, // Squat
                sets: 4,
                reps: 6,
                weight: 155
            }
        ]);

        console.log('Workouts created.');

        console.log('\nDatabase seeded successfully!');
        console.log('Sample users:');
        console.log('- john@example.com / password123');
        console.log('- jane@example.com / password123');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await sequelize.close();
    }
}

seedDatabase();
