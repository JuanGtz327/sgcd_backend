import { DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

export class Clinica extends Model {}

Clinica.init(
  {
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
  },
  {
    tableName: "Clinica",
    sequelize,
    modelName: "Clinica",
  }
);

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Correo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
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
    is_doctor: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    idClinica: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "User",
    sequelize,
    modelName: "User",
  }
);

export class Doctor extends Model {}

Doctor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    idUser: {
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
    Especialidad: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    Cedula: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Doctor",
    sequelize,
    modelName: "Doctor",
  }
);

export class Paciente extends Model {}

Paciente.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    idUser: {
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
    Domicilio: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "Paciente",
    sequelize,
    modelName: "Paciente",
  }
);

export class DocPac extends Model {}

DocPac.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    idDoctor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idPaciente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "DocPac",
    sequelize,
    modelName: "DocPac",
  }
);

export class Cita extends Model {}

Cita.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    idDocPac: {
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
  },
  {
    tableName: "Cita",
    sequelize,
    modelName: "Cita",
  }
);

User.belongsTo(Clinica, { foreignKey: "idClinica" });
Clinica.hasMany(User, { foreignKey: "idClinica" });

User.hasOne(Doctor, { foreignKey: "idUser", onDelete: "CASCADE" });
User.hasOne(Paciente, { foreignKey: "idUser", onDelete: "CASCADE" });

Doctor.hasOne(DocPac, { foreignKey: "idDoctor", onDelete: "CASCADE" });
Paciente.hasOne(DocPac, { foreignKey: "idPaciente", onDelete: "CASCADE" });

DocPac.hasMany(Cita, { foreignKey: "idDocPac", onDelete: "CASCADE" });

export default User;
