import {DataTypes} from 'sequelize'
import sequelize from '../db.js'

const Admin = sequelize.define('Admin',{
    Id_Administrador: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    Correo: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    Password: {
        type: DataTypes.STRING(50),
        allowNull: false,
    }
},{
    tableName: "Admin"
})

export default Admin
