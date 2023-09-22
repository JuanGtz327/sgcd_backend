import {DataTypes} from 'sequelize'
import sequelize from '../db.js'

const User = sequelize.define('User',{
    id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    Correo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    idClinica: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    tableName: "User"
})

export default User
