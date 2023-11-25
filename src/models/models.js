import { DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

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
    tableName: "domicilio",
    sequelize,
    modelName: "Domicilio",
  }
);

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
    Descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idDomicilio: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "clinica",
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
    tableName: "user",
    sequelize,
    modelName: "User",
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
    tableName: "especialidad",
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
    idConfiguraciones:{
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
    tableName: "doctor",
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
    tableName: "paciente",
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
    tableName: "docpac",
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
    Peso:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Estatura:{
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    Presion_arterial: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Frecuencia_cardiaca: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Frecuencia_respiratoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Temperatura: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Grupo_sanguineo: {
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
    }
  },
  {
    tableName: "historial_clinico",
    sequelize,
    modelName: "HistorialClinico",
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
    idHistorialClinico: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "historia_clinica_actual",
    sequelize,
    modelName: "HistoriaClinicaActual",
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
    idHistorialClinico: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    tableName: "nota",
    sequelize,
    modelName: "Nota",
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
    Estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    idHistorialClinico: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    tableName: "cita",
    sequelize,
    modelName: "Cita",
  }
);

export class CancelacionCita extends Model {}

CancelacionCita.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    idCita: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Motivo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Pendiente: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "cancelacioncita",
    sequelize,
    modelName: "CancelacionCita",
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
    idHistoriaClinicaActual: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idDocPac: {
      type: DataTypes.INTEGER,
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
      allowNull: true,
    },
  },
  {
    tableName: "receta",
    sequelize,
    modelName: "Receta",
  }
);

export class Medicamento extends Model {}

Medicamento.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    idReceta: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Dosis: {
      type: DataTypes.STRING,
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
  },
  {
    tableName: "medicamento",
    sequelize,
    modelName: "Medicamento",
  }
);

export class Configuraciones extends Model {}

Configuraciones.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Dias_laborables: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Lunes-Viernes",
    },
    Horario: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "09:00-18:00",
    },
    Duracion_cita: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
  },
  {
    tableName: "configuraciones",
    sequelize,
    modelName: "Configuraciones",
  }
);

Domicilio.hasOne(Clinica, { foreignKey: "idDomicilio", onDelete: "CASCADE" });
Clinica.belongsTo(Domicilio, { foreignKey: "idDomicilio" });

Clinica.hasMany(User, { foreignKey: "idClinica" });
User.belongsTo(Clinica, { foreignKey: "idClinica" });

User.hasOne(Doctor, { foreignKey: "idUser", onDelete: "CASCADE" });
Doctor.belongsTo(User, { foreignKey: "idUser" });

User.hasOne(Paciente, { foreignKey: "idUser", onDelete: "CASCADE" });
Paciente.belongsTo(User, { foreignKey: "idUser" });

Domicilio.hasOne(Doctor, { foreignKey: "idDomicilio", onDelete: "CASCADE" });
Doctor.belongsTo(Domicilio, { foreignKey: "idDomicilio" });

Domicilio.hasOne(Paciente, { foreignKey: "idDomicilio", onDelete: "CASCADE" });
Paciente.belongsTo(Domicilio, { foreignKey: "idDomicilio" });

Doctor.hasOne(DocPac, { foreignKey: "idDoctor", onDelete: "CASCADE" });
Paciente.hasMany(DocPac, { foreignKey: "idPaciente", onDelete: "CASCADE" });
DocPac.belongsTo(Doctor, { foreignKey: "idDoctor" });
DocPac.belongsTo(Paciente, { foreignKey: "idPaciente" });

DocPac.hasMany(Cita, { foreignKey: "idDocPac", onDelete: "CASCADE" });
Cita.belongsTo(DocPac, { foreignKey: "idDocPac" });

DocPac.hasMany(Receta, { foreignKey: "idDocPac", onDelete: "CASCADE" });
Receta.belongsTo(DocPac, { foreignKey: "idDocPac" });

HistoriaClinicaActual.hasOne(Receta, { foreignKey: "idHistoriaClinicaActual", onDelete: "CASCADE" });
Receta.belongsTo(HistoriaClinicaActual, { foreignKey: "idHistoriaClinicaActual" });

DocPac.hasMany(Nota, { foreignKey: "idDocPac", onDelete: "CASCADE" });
Nota.belongsTo(DocPac, { foreignKey: "idDocPac" });

Paciente.hasOne(HistorialClinico, { foreignKey: "idPaciente", onDelete: "CASCADE" });
HistorialClinico.belongsTo(Paciente, { foreignKey: "idPaciente" });

HistoriaMedica.hasOne(HistorialClinico, { foreignKey: "idHistoriaMedica", onDelete: "CASCADE" });
HistorialClinico.belongsTo(HistoriaMedica, { foreignKey: "idHistoriaMedica" });

ExamenFisico.hasOne(HistorialClinico, { foreignKey: "idExamenFisico", onDelete: "CASCADE" });
HistorialClinico.belongsTo(ExamenFisico, { foreignKey: "idExamenFisico" });

HistorialClinico.hasMany(HistoriaClinicaActual, { foreignKey: "idHistorialClinico", onDelete: "CASCADE" });
HistoriaClinicaActual.belongsTo(HistorialClinico, { foreignKey: "idHistorialClinico" });

HistorialClinico.hasMany(Cita, { foreignKey: "idHistorialClinico", onDelete: "CASCADE" });
Cita.belongsTo(HistorialClinico, { foreignKey: "idHistorialClinico" });

HistorialClinico.hasMany(Nota, { foreignKey: "idHistorialClinico", onDelete: "CASCADE" });
Nota.belongsTo(HistorialClinico, { foreignKey: "idHistorialClinico" });

Cita.hasOne(CancelacionCita, { foreignKey: "idCita", onDelete: "CASCADE" });
CancelacionCita.belongsTo(Cita, { foreignKey: "idCita" });

Configuraciones.hasOne(Doctor, { foreignKey: "idConfiguraciones", onDelete: "CASCADE" });
Doctor.belongsTo(Configuraciones, { foreignKey: "idConfiguraciones" });

Receta.hasMany(Medicamento, { foreignKey: "idReceta", onDelete: "CASCADE" });
Medicamento.belongsTo(Receta, { foreignKey: "idReceta" });

export default User;
