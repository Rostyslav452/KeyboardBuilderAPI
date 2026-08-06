import { Sequelize } from 'sequelize';
import sequelize from '../config/db.connection.js';

import { User, initUserModel } from './user.model.js';
import { Part, initPartModel } from './part.model.js';
import { Token, initTokenModel } from './token.model.js';
import { Build, initBuildModel } from './build.model.js';

initUserModel(sequelize);
initPartModel(sequelize);
initBuildModel(sequelize);
initTokenModel(sequelize);

Build.belongsTo(Part, {
    as: 'keyboardSwitch',
    foreignKey: 'switchId',
});
Build.belongsTo(Part, {
    as: 'keyboardCase',
    foreignKey: 'caseId',
});
Build.belongsTo(Part, {
    as: 'keyboardPCB',
    foreignKey: 'pcbId',
});
Build.belongsTo(Part, {
    as: 'keyboardKeycap',
    foreignKey: 'keycapId',
});

Build.belongsTo(User, {
    foreignKey: 'username',
    targetKey: 'username',
});

Token.belongsTo(User, { foreignKey: 'username' });

User.hasMany(Build, { foreignKey: 'username' });
User.hasMany(Token, { foreignKey: 'username' });

export default {
    sequelize,
    Sequelize,
    User,
    Part,
    Token,
    Build,
};
