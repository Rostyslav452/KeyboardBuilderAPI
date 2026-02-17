import app from "./src/app.js";
import { sequelize } from "./src/models/index.js";

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection to DB successful");

        await sequelize.sync({ alter: true });

        app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
    } catch (error) {
        console.error("Failed to connect:", error);
    }
};

start();
