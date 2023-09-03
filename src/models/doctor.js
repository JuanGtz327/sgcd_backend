import {DataTypes} from 'sequelize'
import sequelize from '../db.js'

const Doctor = sequelize.define('Doctor',{
    Id_Doctor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    Nombre: {
        type: DataTypes.STRING(25),
        allowNull: false,
    },
    ApellidoM: {
        type: DataTypes.STRING(25),
        allowNull: false,
    },
    ApellidoP: {
        type: DataTypes.STRING(25),
        allowNull: false,
    },
    Especialidad: {
        type: DataTypes.STRING(25),
        allowNull: false,
    },
    Consultorio: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Correo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    tableName: "Doctor"
})

export default Doctor
