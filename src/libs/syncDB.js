import sequelize from '../db.js'

const refreshDB = async () => {
  try {
    await sequelize.sync({ alter: true });
    return 'Database refreshed';
  } catch (error) {
    return JSON.stringify(error);
  }
};

export default refreshDB;