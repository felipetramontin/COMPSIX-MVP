const isTest = process.env.NODE_ENV === 'test';

const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Initialize database connection
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: isTest ? `database/test.db` : `database/${process.env.DB_NAME}`,
    logging: false
});

// Import models (each returns a model when called)
const User = require('./models/User')(sequelize, DataTypes);
const Session = require('./models/Session')(sequelize, DataTypes);
const Exercise = require('./models/Exercise')(sequelize, DataTypes);
const Workout = require('./models/Workout')(sequelize, DataTypes);

// Define Relationships
User.hasMany(Session, { foreignKey: 'user_id' });
Session.belongsTo(User, { foreignKey: 'user_id' });

Session.hasMany(Workout, { foreignKey: 'session_id' });
Workout.belongsTo(Session, { foreignKey: 'session_id' });

Exercise.hasMany(Workout, { foreignKey: 'exercise_id' });
Workout.belongsTo(Exercise, { foreignKey: 'exercise_id' });

// Sync database
sequelize.authenticate()
    .then(() => console.log("Database connected"))
    .catch(err => console.error(err));


module.exports = {
    sequelize,
    User,
    Session,
    Exercise,
    Workout
};
