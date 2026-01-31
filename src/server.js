import app from "./app.js";
import sequelize from "./models/index.js";

const PORT = process.env.PORT || 3000;


const start = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection to DB successful");

        await sequelize.sync({ alter: true });

        app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
    } catch (e) {
        console.error("Failed to connect:", e);
    }
};

start();

