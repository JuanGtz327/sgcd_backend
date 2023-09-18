import { Sequelize } from "sequelize";

const debugging = process.env.ENVIROMENT == "dev" ? true : false;

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: debugging,
    timezone: "America/Mexico_City",
    dialectOptions: {
      useUTC: false, // for reading from database
      dateStrings: true,
      typeCast(field, next) {
        if (field.type === "DATETIME") {
          return field.string();
        }
        return next();
      },
    },
  }
);

export const connectedDB = async (db) => {
  try {
    await sequelize.authenticate();
    console.log(`DB is connected`);
  } catch (error) {
    console.error(`BD ERROR ${error}`);
  }
};

export default sequelize;
