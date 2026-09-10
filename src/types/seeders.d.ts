declare module '*.cjs' {
   export const up: (
      queryInterface: import('sequelize').QueryInterface,
      sequelize: unknown,
   ) => Promise<void>;
   export const down: (
      queryInterface: import('sequelize').QueryInterface,
      sequelize: unknown,
   ) => Promise<void>;
}
