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

class Configuraciones extends Model {}

Configuraciones.init(
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
    configuraciones: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
    }
  },
  {
    tableName: "Configuraciones",
    sequelize,
    modelName: "Configuraciones",
  }
);

export class Domicilio extends Model {}

Domicilio.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Calle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Num_ext: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Num_int: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Estado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Municipio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Colonia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CP: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Telefono:{
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    tableName: "Domicilio",
    sequelize,
    modelName: "Domicilio",
  }
);

export class Especialidad extends Model {}

Especialidad.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Especialidad",
    sequelize,
    modelName: "Especialidad",
    timestamps: false,
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
    ApellidoP: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    ApellidoM: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    CURP: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Cedula: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Especialidad: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idDomicilio:{
      type: DataTypes.INTEGER,
      allowNull: false,
    }
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
    Nombre: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    ApellidoP: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    ApellidoM: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    Genero: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    Fecha_nacimiento: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    CURP: {
      type: DataTypes.STRING(18),
      allowNull: false,
    },
    idDomicilio: {
      type: DataTypes.INTEGER,
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

export class Nota extends Model {}

Nota.init(
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
    Nota: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "DocPac",
    sequelize,
    modelName: "DocPac",
  }
);

export class HistoriaMedica extends Model {}

HistoriaMedica.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Enfermedades_hereditarias: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Enfermedades_previas: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Cirugias: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Alergias: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Traumatismos: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Vacunas: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Habitos_salud: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "historia_medica",
    sequelize,
    modelName: "HistoriaMedica",
  }
);

export class ExamenFisico extends Model {}

ExamenFisico.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Presion_arterial: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Frecuencia_cardiaca: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Frecuencia_respiratoria: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Temperatura: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Exploracion_detallada: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "examen_fisico",
    sequelize,
    modelName: "ExamenFisico",
  }
);

export class HistoriaClinicaActual extends Model {}

HistoriaClinicaActual.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Motivo_consulta: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Sintomas: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Fecha_inicio_sintomas: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Plan_tratamiento: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "historia_clinica_actual",
    sequelize,
    modelName: "HistoriaClinicaActual",
  }
);

export class HistorialClinico extends Model {}

HistorialClinico.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    idPaciente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idHistoriaMedica: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idExamenFisico: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idHistoriaClinicaActual: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idCita: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idNota: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "historial_clinico",
    sequelize,
    modelName: "HistorialClinico",
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
    Diagnostico: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    idReceta: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "Cita",
    sequelize,
    modelName: "Cita",
  }
);

export class Receta extends Model {}

Receta.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Medicamento: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Unidad: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Dosis: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Frecuencia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Via_administracion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Fecha_fin: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Indicaciones: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Receta",
    sequelize,
    modelName: "Receta",
  }
);

Clinica.hasMany(User, { foreignKey: "idClinica" });
User.belongsTo(Clinica, { foreignKey: "idClinica" });

Configuraciones.belongsTo(User, { foreignKey: "idUser" });
User.hasOne(Configuraciones, { foreignKey: "idUser", onDelete: "CASCADE" });

User.hasOne(Doctor, { foreignKey: "idUser", onDelete: "CASCADE" });
Doctor.belongsTo(User, { foreignKey: "idUser" });

User.hasOne(Paciente, { foreignKey: "idUser", onDelete: "CASCADE" });
Paciente.belongsTo(User, { foreignKey: "idUser" });

Domicilio.hasOne(Doctor, { foreignKey: "idDomicilio", onDelete: "CASCADE" });
Doctor.belongsTo(Domicilio, { foreignKey: "idDomicilio" });

Domicilio.hasOne(Paciente, { foreignKey: "idDomicilio", onDelete: "CASCADE" });
Paciente.belongsTo(Domicilio, { foreignKey: "idDomicilio" });

Doctor.hasOne(DocPac, { foreignKey: "idDoctor", onDelete: "CASCADE" });
Paciente.hasOne(DocPac, { foreignKey: "idPaciente", onDelete: "CASCADE" });
DocPac.belongsTo(Doctor, { foreignKey: "idDoctor" });
DocPac.belongsTo(Paciente, { foreignKey: "idPaciente" });

DocPac.hasMany(Cita, { foreignKey: "idDocPac", onDelete: "CASCADE" });
Cita.belongsTo(DocPac, { foreignKey: "idDocPac" });

Cita.hasOne(Receta, { foreignKey: "idReceta", onDelete: "CASCADE" });
Receta.belongsTo(Cita, { foreignKey: "idReceta" });

DocPac.hasMany(Nota, { foreignKey: "idDocPac", onDelete: "CASCADE" });
Nota.belongsTo(DocPac, { foreignKey: "idDocPac" });

Paciente.hasOne(HistorialClinico, { foreignKey: "idPaciente", onDelete: "CASCADE" });
HistorialClinico.belongsTo(Paciente, { foreignKey: "idPaciente" });

HistorialClinico.hasOne(HistoriaMedica, { foreignKey: "idHistoriaMedica", onDelete: "CASCADE" });
HistoriaMedica.belongsTo(HistorialClinico, { foreignKey: "idHistoriaMedica" });

HistorialClinico.hasOne(ExamenFisico, { foreignKey: "idExamenFisico", onDelete: "CASCADE" });
ExamenFisico.belongsTo(HistorialClinico, { foreignKey: "idExamenFisico" });

HistorialClinico.hasOne(HistoriaClinicaActual, { foreignKey: "idHistoriaClinicaActual", onDelete: "CASCADE" });
HistoriaClinicaActual.belongsTo(HistorialClinico, { foreignKey: "idHistoriaClinicaActual" });

HistorialClinico.hasOne(Cita, { foreignKey: "idCita", onDelete: "CASCADE" });
Cita.belongsTo(HistorialClinico, { foreignKey: "idCita" });

HistorialClinico.hasOne(Nota, { foreignKey: "idNota", onDelete: "CASCADE" });
Nota.belongsTo(HistorialClinico, { foreignKey: "idNota" });

export default User;
