const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Initialize database connection
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: `database/${process.env.DB_NAME}`,
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
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        await sequelize.sync({ force: false });
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to database:', error);
    }
})();

module.exports = {
    sequelize,
    User,
    Session,
    Exercise,
    Workout
};
