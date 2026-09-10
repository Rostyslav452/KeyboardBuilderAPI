import {
   Model,
   InferAttributes,
   InferCreationAttributes,
   CreationOptional,
   DataTypes,
   Sequelize,
} from 'sequelize';

export class Part extends Model<InferAttributes<Part>, InferCreationAttributes<Part>> {
   declare id: CreationOptional<string>;
   declare name: string;
   declare type: 'switch' | 'case' | 'pcb' | 'keycap';
   declare price: number;
   declare specs: object;
}

export const initPartModel = (sequelize: Sequelize) => {
   Part.init(
      {
         id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
         },
         name: {
            type: DataTypes.STRING(64),
            allowNull: false,
            unique: true,
            validate: {
               len: [3, 64],
            },
         },
         type: {
            type: DataTypes.ENUM('switch', 'case', 'pcb', 'keycap'),
            allowNull: false,
         },
         price: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: false,
            validate: {
               min: 1,
               max: 99999,
            },
         },
         specs: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
         },
      },
      {
         sequelize,
         modelName: 'Part',
         tableName: 'parts',
         timestamps: false,
      },
   );

   return Part;
};
