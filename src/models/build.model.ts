import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
    Sequelize,
} from 'sequelize';

export class Build extends Model<InferAttributes<Build>, InferCreationAttributes<Build>> {
    declare buildId: CreationOptional<string>;
    declare name: string;
    declare username: string;
    declare switchId: string;
    declare caseId: string;
    declare pcbId: string;
    declare keycapId: string;
}

export const initBuildModel = (sequelize: Sequelize) => {
    Build.init(
        {
            buildId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            name: {
                type: DataTypes.STRING(64),
                allowNull: false,
                validate: {
                    len: [3, 64],
                },
            },
            username: {
                type: DataTypes.STRING(64),
                allowNull: false,
                references: {
                    key: 'username',
                    model: 'users',
                },
            },
            switchId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    key: 'partId',
                    model: 'parts',
                },
            },
            caseId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    key: 'partId',
                    model: 'parts',
                },
            },
            pcbId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    key: 'partId',
                    model: 'parts',
                },
            },
            keycapId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    key: 'partId',
                    model: 'parts',
                },
            },
        },
        {
            sequelize,
            modelName: 'Build',
            tableName: 'builds',
            timestamps: false,
        },
    );

    return Build;
};
