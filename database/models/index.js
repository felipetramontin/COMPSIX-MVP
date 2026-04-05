const User = require('./User');
const Session = require('./Session');
const Exercise = require('./Exercise');
const Workout = require('./Workout');

// User → Sessions
User.hasMany(Session, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Session.belongsTo(User, { foreignKey: 'user_id' });

// Session → Workouts
Session.hasMany(Workout, { foreignKey: 'session_id', onDelete: 'CASCADE' });
Workout.belongsTo(Session, { foreignKey: 'session_id' });

// Exercise → Workouts
Exercise.hasMany(Workout, { foreignKey: 'exercise_id', onDelete: 'CASCADE' });
Workout.belongsTo(Exercise, { foreignKey: 'exercise_id' });

module.exports = { User, Session, Exercise, Workout };
