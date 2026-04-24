const bcrypt = require('bcryptjs');
const { sequelize, User, Exercise, Session, Workout } = require('./setup');

async function seed() {
  try {
    console.log("Resetting database...");
    await sequelize.sync({ force: true });

    // USERS
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: await bcrypt.hash("adminpass", 10),
      role: "admin"
    });

    const trainer = await User.create({
      name: "Trainer User",
      email: "trainer@example.com",
      password: await bcrypt.hash("trainerpass", 10),
      role: "trainer"
    });

    const client = await User.create({
      name: "Client User",
      email: "client@example.com",
      password: await bcrypt.hash("clientpass", 10),
      role: "client"
    });

    // EXERCISES
    const exercises = await Exercise.bulkCreate([
      { name: "Bench Press", muscle_group: "Chest", description: "Barbell bench press" },
      { name: "Squat", muscle_group: "Legs", description: "Barbell back squat" },
      { name: "Deadlift", muscle_group: "Back", description: "Conventional deadlift" }
    ]);

    // SESSION FOR CLIENT
    const session = await Session.create({
      user_id: client.id,
      date: "2025-04-01",
      notes: "Upper body day"
    });

    // WORKOUTS
    await Workout.bulkCreate([
      {
        session_id: session.id,
        exercise_id: exercises[0].id, // Bench Press
        sets: 3,
        reps: 8,
        weight: 185
      },
      {
        session_id: session.id,
        exercise_id: exercises[2].id, // Deadlift
        sets: 3,
        reps: 5,
        weight: 275
      }
    ]);

    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await sequelize.close();
  }
}

seed();
