module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Workout', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        session_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        exercise_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sets: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reps: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        weight: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    });
};
