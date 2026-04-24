const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const isTest = process.env.NODE_ENV === 'test';

// Ensure database folder exists (Render needs this!)
const dbFolder = path.join(__dirname);
if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder, { recursive: true });
}

const dbPath = isTest
    ? path.join(__dirname, 'test.db')
    : path.join(__dirname, process.env.DB_NAME || 'dev.db');

// Initialize SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false
});

// Import models
const User = require('./models/User')(sequelize, DataTypes);
const Session = require('./models/Session')(sequelize, DataTypes);
const Exercise = require('./models/Exercise')(sequelize, DataTypes);
const Workout = require('./models/Workout')(sequelize, DataTypes);

// Define relationships
User.hasMany(Session, { foreignKey: 'user_id' });
Session.belongsTo(User, { foreignKey: 'user_id' });

Session.hasMany(Workout, { foreignKey: 'session_id' });
Workout.belongsTo(Session, { foreignKey: 'session_id' });

Exercise.hasMany(Workout, { foreignKey: 'exercise_id' });
Workout.belongsTo(Exercise, { foreignKey: 'exercise_id' });

// DO NOT authenticate() here — it crashes on Render
// DO NOT sync() here — do it in index.js

module.exports = {
    sequelize,
    User,
    Session,
    Exercise,
    Workout
};
