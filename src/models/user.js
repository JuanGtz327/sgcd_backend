import {DataTypes,Model} from 'sequelize'
import sequelize from '../db.js'

class User extends Model{}

User.init({
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
        defaultValue: false,
    },
    idClinica: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    tableName: "User",
    sequelize,
    modelName: "User"
})

export class Doctor extends Model{}

Doctor.init({
    id: {
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
    Cedula: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    tableName: "Doctor",
    sequelize,
    modelName: "Doctor"
})

User.belongsTo(Doctor, { foreignKey: 'id' });
Doctor.hasOne(User, { foreignKey: 'id' });

export default User
