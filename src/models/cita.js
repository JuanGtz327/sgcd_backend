import {DataTypes} from 'sequelize'
import sequelize from '../db.js'

const Cita = sequelize.define('Cita',{
    Id_Cita: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    Id_Doctor: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Id_Paciente: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Fecha: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    Descripcion: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
},{
    tableName: "Cita"
})

export default Cita
