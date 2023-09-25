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
    logging: false,
    timezone: "-06:00",
    dialectOptions: {
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
