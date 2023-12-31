import { Sequelize } from "sequelize";

const zone = process.env.ENVIROMENT == "dev" ? '-06:00' : '+00:00';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
    timezone: zone,
    dialectOptions: {
      dateStrings: true,
      typeCast(field, next) {
        if (field.type === "DATETIME") {
          return field.string();
        }
        if (field.type === "DATE") {
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
