import {DataTypes} from 'sequelize'
import sequelize from '../db.js'

const Clinica = sequelize.define('Clinica',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    Nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
},{
    tableName: "Clinica"
})

export default Clinica
