import sequelize from "../config/db.js";
import User from "./userModel.js";
import Part from "./partsModel.js";
import Build from "./buildModel.js";

Build.belongsTo(Part, { as: "keyboardSwitch", foreignKey: "switchId" });
Build.belongsTo(Part, { as: "keyboardCase", foreignKey: "caseId" });
Build.belongsTo(Part, { as: "keyboardPCB", foreignKey: "pcbId" });
Build.belongsTo(Part, { as: "keyboardKeycap", foreignKey: "keycapId" });

User.hasMany(Build, { foreignKey: "username" });
Build.belongsTo(User, {
    foreignKey: "username",
    targetKey: "username",
});

export { Build, User, Part, sequelize };
