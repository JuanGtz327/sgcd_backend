import {DataTypes} from 'sequelize'
import sequelize from '../db.js'

const Habitacion = sequelize.define('Habitacion',{
    Id_Habitacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    Habitacion: {
        type: DataTypes.STRING(5),
        allowNull: false,
    },
},{
    tableName: "Habitacion"
})

export default Habitacion;