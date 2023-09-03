import {DataTypes} from 'sequelize'
import sequelize from '../db.js'

const Receta = sequelize.define('Receta',{
    Id_Receta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    Id_Cita: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Descripcion: {
        type: DataTypes.STRING(5),
        allowNull: false,
    },
},{
    tableName: "Receta"
})

export default Receta;