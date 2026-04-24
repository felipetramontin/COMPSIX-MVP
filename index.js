const app = require('./server');
const { sequelize } = require('./database/setup');

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    console.log("Database synced");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
