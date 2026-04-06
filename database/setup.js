const { sequelize } = require('../setup');
require('../models/User');
require('../models/Session');
require('../models/Exercise');
require('../models/Workout');

(async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synced');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
