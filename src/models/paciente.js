import {DataTypes} from 'sequelize'
import sequelize from '../db.js'

const Paciente = sequelize.define('Paciente',{
    Id_Paciente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    Id_Doctor: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Edad: {
        type: DataTypes.INTEGER,
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
    Genero: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    Correo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique:true
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Domicilio: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
},{
    tableName: "Paciente"
})

export default Paciente
