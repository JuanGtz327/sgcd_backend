import express from "express";
import moment from "moment/moment.js";
import pkg from '@pdftron/pdfnet-node';
const { PDFNet } = pkg;
import path from "path";
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import fs from "fs";
const router = express.Router();
import sequelize from "../db.js";
import { Op } from "sequelize";

import bcrypt from "bcryptjs";
import { authRequired } from "../middlewares/validateToken.js";
import { horaEnRangoDayJS , tieneDosHorasDeDiferencia } from '../libs/libs.js'

import dayjs from "dayjs";
import "dayjs/locale/es.js";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("es");

import User, {
  Clinica,
  Doctor,
  Paciente,
  DocPac,
  Cita,
  Especialidad,
  Domicilio,
  CancelacionCita,
  HistoriaMedica,
  ExamenFisico,
  HistoriaClinicaActual,
  HistorialClinico,
  Nota,
  Configuraciones,
  Receta,
  Medicamento,
} from "../models/models.js";

router.get("/refresh-db", async (req, res) => {
  try {
    await sequelize.sync({ alter: true });
    res.send("DB refreshed");
  } catch (error) {
    res.send(JSON.stringify(error));
  }
});

router.get("/metricas", async (req, res) => {
  res.json({
    ServerTime: dayjs().tz("America/Mexico_City").format("DD/MM/YYYY HH:mm:ss"),
    Metricas: {
      doctorsTotal: await Doctor.count(),
      patientsTotal: await Paciente.count(),
      appointmentsTotal: await Cita.count(),
      clinicsTotal: await Clinica.count(),
    },
    DB: {
      statusDB: sequelize.options.database,
      statusDBHost: sequelize.options.host,
      statusDBPort: sequelize.options.port,
      statusDBDialect: sequelize.options.dialect,
      statusDBDialectOptions: sequelize.options.dialectOptions,
      statusDBTimezone: sequelize.options.timezone,
      statusDBTime: await sequelize.query("SELECT NOW()"),
    }
  });
});

router.get("/pruebahistorial", async (req, res) => {
  const a = await HistorialClinico.findAll({
    attributes: ["id"],
    include: [
      {
        model: Paciente,
        required: true,
        include: [
          {
            model: DocPac,
            required: true,
            include: [
              {
                model: Doctor,
                required: true,
                include: [
                  {
                    model: User,
                    required: true,
                  },
                ],
              },
            ],
          },
          {
            model: User,
            required: true,
          },
          {
            model: Domicilio,
            required: true,
          },
        ],
      },
      {
        model: HistoriaMedica,
        required: true,
      },
      {
        model: ExamenFisico,
        required: true,
      },
      {
        model: HistoriaClinicaActual,
        required: false,
      },
      {
        model: Cita,
        required: false,
      },
      {
        model: Nota,
        required: false,
      },
    ],
  });
  res.json(a);
});

router.get("/pruebapacientes", async (req, res) => {
  const a = await Paciente.findAll({
    attributes: {
      exclude: ["idDomicilio", "createdAt", "updatedAt"],
    },
    include: [
      {
        model: DocPac,
        attributes: ["id"],
        required: true,
        include: [
          {
            model: Doctor,
            attributes: ["Nombre", "ApellidoP", "ApellidoM"],
            required: true,
            where: { id: 2 },
            include: [
              {
                model: User,
                attributes: ["Correo", "idClinica"],
                required: true,
              },
            ],
          },
        ],
      },
      {
        model: User,
        attributes: ["Correo", "idClinica"],
        required: true,
      },
      {
        model: Domicilio,
        required: true,
        attributes: {
          exclude: ["id", "createdAt", "updatedAt"],
        },
      },
      {
        model: HistorialClinico,
        required: true,
        include: [
          {
            model: HistoriaMedica,
            required: true,
          },
          {
            model: ExamenFisico,
            required: true,
          },
          {
            model: HistoriaClinicaActual,
            required: true,
          },
          {
            model: Cita,
            required: false,
          },
          {
            model: Nota,
            required: false,
          },
        ],
      },
    ],
  });
  res.json(a);
});

router.get("/pruebadoctores", async (req, res) => {
  const a = await Doctor.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: [
      {
        model: User,
        attributes: ["Correo", "idClinica"],
        required: true,
        where: { idClinica: 1 },
      },
      {
        model: Domicilio,
        required: true,
        attributes: {
          exclude: ["id", "createdAt", "updatedAt"],
        },
      },
    ],
  });
  res.json(a);
});

router.get("/pruebas", async (req, res) => {
  const appointments = await Cita.findAll({
    where: { Estado: true },
    include: [
      {
        attributes: ["id"],
        model: DocPac,
        required: true,
        include: [
          {
            model: Paciente,
            required: true,
            include: [
              {
                attributes: ["Correo"],
                model: User,
                required: true,
              },
            ],
          },
          {
            model: Doctor,
            required: true,
            where: { id: 2 },
            include: [
              {
                attributes: ["Correo"],
                model: User,
                required: true,
                where: { idClinica: 1 },
              },
            ],
          },
        ],
      },
      {
        model: CancelacionCita,
        required: false,
      }
    ],
  });

  res.status(200).json(appointments);
});

// Handle doctors

router.get("/getDoctorConfigs/:id", authRequired, async (req, res) => {
  const { id } = req.params;
  const configs = await Doctor.findOne({
    where: { id },
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: [
      {
        model: Configuraciones,
        required: true,
        attributes: {
          exclude: ["id", "createdAt", "updatedAt"],
        },
      },
    ],
  });
  res.status(200).json(configs);
});

router.post("/addDoctor", authRequired, async (req, res) => {
  const { ...parametros } = req.body;
  const { idClinica } = req.user;
  const t = await sequelize.transaction();
  try {
    const userExists = await User.findOne({
      where: { Correo: parametros.Correo },
    });
    if (userExists)
      return res
        .status(400)
        .json({ message: "La direccion de correo ya esta en uso" });

    //Guardar las configuraciones del doctor

    const docConfigPayload = {
      Dias_laborables: parametros.Dias_laborales,
      Horario: parametros.Horario,
      Duracion_cita: parametros.Duracion,
    };

    if (!tieneDosHorasDeDiferencia(docConfigPayload.Horario.split("-")[0], docConfigPayload.Horario.split("-")[1])) {
      await t.rollback();
      return res.status(400).json({ message: "El horario de trabajo debe tener minimo una duracion de 2 horas" });
    }

    const docConfig = await Configuraciones.create(docConfigPayload, { transaction: t, });

    //Guardar el doctor en la tabla de usuarios

    const passwordHash = await bcrypt.hash(parametros.Password, 10);

    const userPayload = {
      Correo: parametros.Correo,
      Password: passwordHash,
      idClinica: idClinica,
    };

    const user = await User.create(userPayload, { transaction: t });

    //Guardar el domicilio del doctor

    //Verificar si el numero de telefono ya esta en uso
    const telefonoExists = await Domicilio.findOne({
      where: { Telefono: parametros.Telefono },
    });

    if (telefonoExists) {
      await t.rollback();
      return res.status(400).json({ message: "El numero de telefono ya esta en uso" });
    }

    const domicilioPayload = {
      Calle: parametros.Calle,
      Num_ext: parametros.Num_ext,
      Num_int: parametros.Num_int,
      Estado: parametros.Estado,
      Municipio: parametros.Municipio,
      Colonia: parametros.Colonia,
      CP: parametros.CP,
      Telefono: parametros.Telefono,
    };

    const domicilio = await Domicilio.create(domicilioPayload, {
      transaction: t,
    });

    //Guardar el doctor en la tabla de doctores

    const doctorPayload = {
      idUser: user.id,
      Nombre: parametros.Nombre,
      ApellidoP: parametros.ApellidoP,
      ApellidoM: parametros.ApellidoM,
      CURP: parametros.CURP,
      Cedula: parametros.Cedula,
      Especialidad: parametros.Especialidad,
      Genero: parametros.Genero,
      idDomicilio: domicilio.id,
      idConfiguraciones: docConfig.id,
    };

    const doctor = await Doctor.create(doctorPayload, { transaction: t });

    await t.commit();

    res.json(doctor);
  } catch (error) {
    console.log(error);
    await t.rollback();
    res.status(500).json({ message: error });
  }
});

router.get("/getDoctors", authRequired, async (req, res) => {
  const doctors = await Doctor.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: [
      {
        model: User,
        attributes: ["Correo", "idClinica"],
        required: true,
        where: { idClinica: req.user.idClinica },
      },
      {
        model: Domicilio,
        required: true,
        attributes: {
          exclude: ["id", "createdAt", "updatedAt"],
        },
      },
    ],
  });
  res.status(200).json(doctors);
});

router.get("/getDoctor/:idDoctor", authRequired, async (req, res) => {
  const { idDoctor } = req.params;

  const includeDocPacs = await DocPac.findAll({ where: { idDoctor }, });

  const doctor = await Doctor.findOne({
    where: { id: idDoctor },
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: [
      {
        model: User,
        attributes: ["Correo", "idClinica"],
        required: true,
        where: { idClinica: req.user.idClinica },
      },
      {
        model: Domicilio,
        required: true,
        attributes: {
          exclude: ["id", "createdAt", "updatedAt"],
        },
      },
      {
        model: Configuraciones,
        required: true,
        attributes: {
          exclude: ["id", "createdAt", "updatedAt"],
        },
      },
      {
        model: DocPac,
        required: includeDocPacs.length > 0 ? true : false,
      }
    ],
  });
  res.status(200).json(doctor);
});

router.get("/getPatientDoctors/:idPaciente", authRequired, async (req, res) => {
  const { idPaciente } = req.params;
  const doctors = await Doctor.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: [
      {
        model: User,
        attributes: ["Correo", "idClinica"],
        required: true,
        where: { idClinica: req.user.idClinica },
      },
      {
        model: Domicilio,
        required: true,
        attributes: {
          exclude: ["id", "createdAt", "updatedAt"],
        },
      },
      {
        model: DocPac,
        required: true,
        include: [
          {
            model: Paciente,
            required: true,
            where: { id: idPaciente },
          },
        ],
      },
    ],
  });
  res.status(200).json(doctors);
});

router.put("/editDoctor/:idDoc", authRequired, async (req, res) => {
  const { ...parametros } = req.body;
  const { idDoc } = req.params;

  const t = await sequelize.transaction();

  try {
    if (!idDoc)
      return res.status(400).send({ message: "You must provide an Id_Doctor" });

    const doctor = await Doctor.findOne({ where: { id: idDoc } });
    if (!doctor) return res.status(404).send({ message: "Doctor not found" });
    const updatedDoctor = await Doctor.update(parametros, {
      where: { id: idDoc },
      transaction: t,
    });

    //Actualizar el usuario con el correo del doctor si se paso como parametro

    if (parametros.Correo) {
      //Consultar si el email ya esta en uso
      const userExists = await User.findOne({
        where: { Correo: parametros.Correo },
      });
      if (userExists)
        return res
          .status(400)
          .json({ message: "La direccion de correo ya esta en uso" });

      const user = await User.findOne({ where: { id: doctor.idUser } });
      if (!user) return res.status(404).send({ message: "User not found" });
      await User.update(
        { Correo: parametros.Correo },
        { where: { id: user.id }, transaction: t }
      );
    }

    if (parametros.Password) {
      const passwordHash = await bcrypt.hash(parametros.Password, 10);
      const user = await User.findOne({ where: { id: doctor.idUser } });
      if (!user) return res.status(404).send({ message: "User not found" });
      await User.update({ Password: passwordHash }, { where: { id: user.id }, transaction: t });
    }

    if (parametros.DomicilioPayload) {
      const domicilio = await Domicilio.findOne({ where: { id: doctor.idDomicilio } });
      if (!domicilio) return res.status(404).send({ message: "Domicilio not found" });
      await Domicilio.update(parametros.DomicilioPayload, { where: { id: domicilio.id }, transaction: t });
    }

    await t.commit();
    res.status(200).send(updatedDoctor);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error });
  }
});

router.put("/editDoctorConfigs/:idDoc", authRequired, async (req, res) => {
  const { configuracionesPayload } = req.body;
  const { idDoc } = req.params;

  const t = await sequelize.transaction();

  try {
    if (!idDoc)
      return res.status(400).send({ message: "You must provide an Id_Doctor" });

    const doctor = await Doctor.findOne({ where: { id: idDoc } });
    if (!doctor) return res.status(404).send({ message: "Doctor not found" });

    const configuraciones = await Configuraciones.findOne({ where: { id: doctor.idConfiguraciones } });
    if (!configuraciones) return res.status(404).send({ message: "Configuraciones not found" });

    //Checar que no haya citas agendadas en dias que se quieren eliminar

    const citas = await Cita.findAll({
      where: { Estado: true },
      include: [
        {
          attributes: ["id"],
          model: DocPac,
          required: true,
          include: [
            {
              model: Paciente,
              required: true,
              include: [
                {
                  attributes: ["Correo"],
                  model: User,
                  required: true,
                },
              ],
            },
            {
              model: Doctor,
              required: true,
              where: { id: idDoc },
              include: [
                {

                  attributes: ["Correo"],
                  model: User,
                  required: true,
                  where: { idClinica: req.user.idClinica },
                },
              ],
            },
          ],
        },
        {
          model: CancelacionCita,
          required: false,
        }
      ],
    });

    const days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sabado",
    ];

    const citasAgendadas = citas.filter(cita => {
      if (dayjs().tz("America/Mexico_City").isAfter(dayjs(cita.Fecha).tz("America/Mexico_City")))
        return false;
      const citaDate = dayjs(cita.Fecha).tz("America/Mexico_City");
      return !configuracionesPayload.Dias_laborables.includes(days[citaDate.day()]);
    });

    if (citasAgendadas.length > 0) {
      await t.rollback();
      return res.status(400).json({ message: "No se pueden eliminar dias que ya tienen citas agendadas" });
    }

    //Checar que no haya citas agendadas en horas que se quieren eliminar

    const citasHoras = citas.filter(cita => {
      if (dayjs().tz("America/Mexico_City").isAfter(dayjs(cita.Fecha).tz("America/Mexico_City")))
        return false;
      const citaDate = dayjs(cita.Fecha).tz("America/Mexico_City");
      const citaHora = citaDate.format("HH:mm");
      return !horaEnRangoDayJS(citaHora, configuracionesPayload.Horario.split("-")[0], configuracionesPayload.Horario.split("-")[1]);
    });

    if (citasHoras.length > 0) {
      await t.rollback();
      return res.status(400).json({ message: "No se puede actualizar el horario por que hay una cita fuera de rango" });
    }

    //Verificar que el horario tenga una duracion de 2 horas

    if (!tieneDosHorasDeDiferencia(configuracionesPayload.Horario.split("-")[0], configuracionesPayload.Horario.split("-")[1])) {
      await t.rollback();
      return res.status(400).json({ message: "El horario de trabajo debe tener minimo una duracion de 2 horas" });
    }

    const updatedConfiguraciones = await Configuraciones.update(configuracionesPayload, {
      where: { id: configuraciones.id },
      transaction: t,
    });

    await t.commit();
    res.status(200).send(updatedConfiguraciones);
  } catch (error) {
    console.log(error);
    await t.rollback();
    res.status(500).json({ message: error });
  }
});

router.delete("/deleteDoctor/:idDoc", authRequired, async (req, res) => {
  const { idDoc } = req.params;

  await User.destroy({ where: { id: idDoc } });

  res.status(200).json({ message: `Doctor ${idDoc} deleted` });
});

// Perfil del usuario

router.get("/getProfile", authRequired, async (req, res) => {
  const { id, is_admin, is_doctor } = req.user;

  if (!is_admin && is_doctor) {
    const user = await User.findOne({
      where: { id },
      attributes: {
        exclude: ["Password"],
      },
      include: [
        {
          model: Doctor,
          required: true,
          include: [
            {
              model: Domicilio,
              required: true,
            }
          ]
        }
      ]
    });
    return res.status(200).json(user);
  } else if (!is_admin && !is_doctor) {
    const user = await User.findOne({
      where: { id },
      attributes: {
        exclude: ["Password"],
      },
      include: [
        {
          model: Paciente,
          required: true,
          include: [
            {
              model: Domicilio,
              required: true,
            }
          ]
        }
      ]
    });
    return res.status(200).json(user);
  } else {
    const user = await User.findOne({
      where: { id },
      attributes: {
        exclude: ["Password"],
      }
    });
    return res.status(200).json(user);
  }
});

router.post("/editPassword", authRequired, async (req, res) => {
  const { LPassword, Password, CPassword, id } = req.body;

  const user = await User.findOne({ where: { id } });

  if (!user) return res.status(404).send({ message: "User not found" });

  const isPasswordValid = await bcrypt.compare(LPassword, user.Password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "La contraseña no es valida" });
  }

  if (Password !== CPassword) {
    return res.status(400).json({ message: "La contraseñas no coinciden" });
  }

  const passwordHash = await bcrypt.hash(Password, 10);
  await User.update({ Password: passwordHash }, { where: { id } });

  res.status(200).json({ message: "Contraseña actualizada" });
});

router.put("/editProfile", authRequired, async (req, res) => {
  const { NombrePayload, DomicilioPayload, CredencialesPayload, id, idDomicilio } = req.body;

  const t = await sequelize.transaction();

  try {
    const user = await User.findOne({ where: { id } });

    if (!user) return res.status(404).send({ message: "User not found" });

    if (!user.is_admin && user.is_doctor) {
      await Doctor.update(NombrePayload, { where: { idUser: id }, transaction: t });
    } else if (!user.is_admin && !user.is_doctor) {
      await Paciente.update(NombrePayload, { where: { idUser: id }, transaction: t });
    }

    await Domicilio.update(DomicilioPayload, { where: { id: idDomicilio }, transaction: t });

    await User.update(CredencialesPayload, { where: { id }, transaction: t });

    await t.commit();

    res.status(200).json({ message: "Perfil actualizado" });

  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error });
  }

});

// Handle Patients

router.post("/addPatient/:doctorID", authRequired, async (req, res) => {
  const {
    pacientePayload,
    domicilioPayload,
    historiaMedicaPayload,
    examenFisicoPayload,
    historiaClinicaActualPayload,
    Correo,
    Password,
    PasswordDoctor,
    preAppointments,
    notas,
  } = req.body;
  const { doctorID } = req.params;
  let { idClinica, idDoctor } = req.user;

  if (req.user.is_admin && doctorID)
    idDoctor = doctorID;

  const t = await sequelize.transaction();
  try {
    if (!idDoctor)
      return res.status(400).send({ message: "You must provide an Id_Doctor" });

    const userExists = await User.findOne({
      where: { Correo: Correo },
    });
    if (userExists) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "La direccion de correo ya esta en uso" });
    }

    //Guardar el paciente en la tabla de usuarios

    const passwordHash = await bcrypt.hash(Password, 10);

    const userPayload = {
      Correo: Correo,
      Password: passwordHash,
      idClinica: idClinica,
      is_doctor: false,
    };

    const user = await User.create(userPayload, { transaction: t });

    //Verificar si el numero de telefono ya esta en uso
    const telefonoExists = await Domicilio.findOne({
      where: { Telefono: domicilioPayload.Telefono },
    });

    if (telefonoExists) {
      await t.rollback();
      return res.status(400).json({ message: "El numero de telefono ya esta en uso" });
    }

    //Guardar el domicilio del paciente

    const domicilio = await Domicilio.create(domicilioPayload, {
      transaction: t,
    });

    //Guardar el paciente en la tabla de pacientes

    pacientePayload.idUser = user.id;
    pacientePayload.idDomicilio = domicilio.id;

    const patient = await Paciente.create(pacientePayload, { transaction: t });

    //Guardar las referencias en la tabla de DocPac

    const docPacPayload = {
      idDoctor,
      idPaciente: patient.id,
    };

    const docpac = await DocPac.create(docPacPayload, { transaction: t });

    //Guardar historial clinico paciente
    const historiaMedica = await HistoriaMedica.create(historiaMedicaPayload, {
      transaction: t,
    });
    const examenFisico = await ExamenFisico.create(examenFisicoPayload, {
      transaction: t,
    });

    const historial_clinico_payload = {
      idPaciente: patient.id,
      idHistoriaMedica: historiaMedica.id,
      idExamenFisico: examenFisico.id,
    };

    const historial_clinico = await HistorialClinico.create(
      historial_clinico_payload,
      { transaction: t }
    );

    // Guardar historia clinica actual que son los padecimientos

    await HistoriaClinicaActual.create(
      { ...historiaClinicaActualPayload, idHistorialClinico: historial_clinico.id },
      { transaction: t }
    );

    //Guardar las citas preestablecidas
    if (preAppointments.length > 0) {
      const citas = preAppointments.map((appointment) => {
        appointment.idDocPac = docpac.id;
        appointment.idHistorialClinico = historial_clinico.id;
        return appointment;
      });

      await Cita.bulkCreate(citas, { transaction: t });
    }

    //Guardar las notas
    if (notas.length > 0) {
      const notes = notas.map((nota) => {
        nota.idDocPac = docpac.id;
        nota.idHistorialClinico = historial_clinico.id;
        return nota;
      });

      await Nota.bulkCreate(notes, { transaction: t });
    }

    //Comprobar password del doctor
    const doctor = await Doctor.findOne({
      where: { id: idDoctor },
      include: [{ model: User }],
    });
    const isPasswordValid = await bcrypt.compare(
      PasswordDoctor,
      doctor.User.Password
    );

    if (!isPasswordValid) {
      await t.rollback();
      return res.status(400).json({ message: "La firma no es valida" });
    }

    await t.commit();
    res.json(historial_clinico);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error });
  }
});

router.get("/getPatients", authRequired, async (req, res) => {
  const patients = await Paciente.findAll({
    attributes: {
      exclude: ["idDomicilio", "createdAt", "updatedAt"],
    },
    include: [
      {
        model: DocPac,
        attributes: ["id"],
        required: true,
        include: [
          {
            model: Doctor,
            attributes: ["Nombre", "ApellidoP", "ApellidoM"],
            required: true,
            where: { id: req.user.idDoctor },
            include: [
              {
                model: User,
                attributes: ["Correo", "idClinica"],
                required: true,
              },
            ],
          },
        ],
      },
      {
        model: User,
        attributes: ["Correo", "idClinica"],
        required: true,
      },
      {
        model: Domicilio,
        required: true,
        attributes: {
          exclude: ["id", "createdAt", "updatedAt"],
        },
      },
    ],
  });
  res.status(200).json(patients);
});

router.get("/getPatientsByDoctor/:idDoctor", authRequired, async (req, res) => {
  const { idDoctor } = req.params;
  const patients = await Paciente.findAll({
    attributes: {
      exclude: ["idDomicilio", "createdAt", "updatedAt"],
    },
    include: [
      {
        model: DocPac,
        attributes: ["id"],
        required: true,
        include: [
          {
            model: Doctor,
            attributes: ["Nombre", "ApellidoP", "ApellidoM"],
            required: true,
            where: { id: idDoctor },
            include: [
              {
                model: User,
                attributes: ["Correo", "idClinica"],
                required: true,
              },
            ],
          },
        ],
      },
      {
        model: User,
        attributes: ["Correo", "idClinica"],
        required: true,
      },
      {
        model: Domicilio,
        required: true,
        attributes: {
          exclude: ["id", "createdAt", "updatedAt"],
        },
      },
    ],
  });
  res.status(200).json(patients);
});

router.get("/getPatientsClinic/:idClinica", authRequired, async (req, res) => {
  const { idClinica } = req.params;
  const patients = await Paciente.findAll({
    attributes: {
      exclude: ["idDomicilio", "createdAt", "updatedAt"],
    },
    include: [
      {
        model: DocPac,
        attributes: ["id"],
        required: true,
        include: [
          {
            model: Doctor,
            attributes: ["Nombre", "ApellidoP", "ApellidoM"],
            required: true,
            include: [
              {
                model: User,
                attributes: ["Correo", "idClinica"],
                required: true,
              },
            ],
          },
        ],
      },
      {
        model: User,
        attributes: ["Correo", "idClinica"],
        required: true,
        where: { idClinica },
      },
      {
        model: Domicilio,
        required: true,
        attributes: {
          exclude: ["id", "createdAt", "updatedAt"],
        },
      },
    ],
  });
  res.status(200).json(patients);
});

router.get("/getPatient/:idPat", authRequired, async (req, res) => {
  const { idPat } = req.params;
  if (!idPat)
    return res.status(400).send({ message: "You must provide an Id_Paciente" });

  const patient = await Paciente.findOne({
    where: { id: idPat },
    include: [
      {
        model: DocPac,
        required: true,
        include: [
          {
            model: Doctor,
            required: true,
            include: [
              {
                model: User,
                required: true,
              },
              {
                model: Domicilio,
                required: true,
              }
            ],
          },
        ],
      },
      {
        model: User,
        required: true,
      },
      {
        model: Domicilio,
        required: true,
      },
      {
        model: HistorialClinico,
        required: true,
        include: [
          {
            model: HistoriaMedica,
            required: true,
          },
          {
            model: ExamenFisico,
            required: true,
          },
          {
            model: HistoriaClinicaActual,
            required: true,
            include: [
              {
                model: Receta,
                required: false,
                include: [
                  {
                    model: Medicamento,
                    required: true,
                  }
                ]
              },
            ],
          },
          {
            model: Cita,
            required: false,
          },
          {
            model: Nota,
            required: false,
          },
        ],
      },
    ],
  });
  res.status(200).json(patient);
});

router.put("/editPatient/:idPat", authRequired, async (req, res) => {
  const { ...parametros } = req.body;
  const { idPat } = req.params;
  if (!idPat)
    return res.status(400).send({ message: "You must provide an Id_Paciente" });

  const paciente = await Paciente.findOne({ where: { id: idPat } });
  if (!paciente) return res.status(404).send({ message: "Paciente not found" });
  const updatedPaciente = await Paciente.update(parametros, {
    where: { id: idPat },
  });

  //Actualizar el usuario con el correo del paciente si se paso como parametro

  if (parametros.Correo) {
    //Consultar si el email ya esta en uso
    const userExists = await User.findOne({
      where: { Correo: parametros.Correo },
    });
    if (userExists)
      return res
        .status(400)
        .json({ message: "La direccion de correo ya esta en uso" });

    const user = await User.findOne({ where: { id: paciente.idUser } });
    if (!user) return res.status(404).send({ message: "User not found" });
    await User.update(
      { Correo: parametros.Correo },
      { where: { id: user.id } }
    );
  }

  if (parametros.Password) {
    const passwordHash = await bcrypt.hash(parametros.Password, 10);
    const user = await User.findOne({ where: { id: paciente.idUser } });
    if (!user) return res.status(404).send({ message: "User not found" });
    await User.update({ Password: passwordHash }, { where: { id: user.id } });
  }

  res.status(200).send(updatedPaciente);
});

router.delete("/deletePatient/:idPat", authRequired, async (req, res) => {
  const { idPat } = req.params;
  await User.destroy({ where: { id: idPat } });

  res.status(200).json({ message: `Patient ${idPat} deleted` });
});

router.post("/addDocPac", authRequired, async (req, res) => {
  const { idDoctor, idPaciente } = req.body;

  const docPacPayload = {
    idDoctor,
    idPaciente,
  };

  const docpac = await DocPac.create(docPacPayload);

  res.status(200).json(docpac);
});

// Handle Citas

router.post("/addCita", authRequired, async (req, res) => {
  const { ...parametros } = req.body;
  const t = await sequelize.transaction();
  try {

    const citaAgendada = await Cita.findOne({
      where: { Fecha: parametros.Fecha, Estado: true },
      include: [{
        model: DocPac, where: { idDoctor: req.user.idDoctor },
        include: [{ model: Paciente, required: true }]
      }]
    });

    if (citaAgendada) {
      return res.status(400).json({ message: `Ya tiene agendada una cita con ${citaAgendada.DocPac.Paciente.Nombre} ${citaAgendada.DocPac.Paciente.ApellidoP}` });
    }

    //Obtener el historial clinico del paciente
    const historial_clinico = await HistorialClinico.findOne({
      where: { idPaciente: parametros.id },
    });

    delete parametros.id;
    parametros.idHistorialClinico = historial_clinico.id;

    const cita = await Cita.create(parametros, { transaction: t });
    res.json(cita);
    await t.commit();
  } catch (error) {
    console.log(error);
    await t.rollback();
    res.status(500).json({ message: error });
  }
});

router.post("/addCitaAdmin", authRequired, async (req, res) => {
  const { idDoctor, idPaciente, Fecha, Diagnostico } = req.body;
  const t = await sequelize.transaction();
  try {

    const citaAgendada = await Cita.findOne({
      where: { Fecha, Estado: true },
      include: [{
        model: DocPac, where: { idDoctor },
        include: [{ model: Paciente, required: true }]
      }]
    });

    if (citaAgendada) {
      return res.status(400).json({ message: `El doctor ya tiene agendada una cita con ${citaAgendada.DocPac.Paciente.Nombre} ${citaAgendada.DocPac.Paciente.ApellidoP}` });
    }

    //Obtener el historial clinico del paciente
    const historial_clinico = await HistorialClinico.findOne({
      where: { idPaciente },
    });

    //ObtenerDocPac
    const docpac = await DocPac.findOne({
      where: { idDoctor, idPaciente },
    });

    const citaPayload = {
      Fecha,
      Diagnostico,
      idHistorialClinico: historial_clinico.id,
      idDocPac: docpac.id
    }

    const cita = await Cita.create(citaPayload, { transaction: t });
    res.json(cita);
    await t.commit();
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error });
  }
});

router.post("/addPatientCita", authRequired, async (req, res) => {
  const { ...parametros } = req.body;
  const t = await sequelize.transaction();
  try {

    const citaAgendada = await Cita.findOne({
      where: { Fecha: parametros.Fecha, Estado: true },
      include: [{
        model: DocPac, where: { idPaciente: req.user.idPaciente },
        include: [{ model: Doctor, required: true }]
      }]
    });

    if (citaAgendada) {
      return res.status(400).json({ message: `Ya tiene agendada una cita con ${citaAgendada.DocPac.Doctor.Nombre} ${citaAgendada.DocPac.Doctor.ApellidoP}` });
    }

    //Obtener el historial clinico del paciente
    const historial_clinico = await HistorialClinico.findOne({
      where: { idPaciente: req.user.idPaciente },
    });

    parametros.idHistorialClinico = historial_clinico.id;

    const cita = await Cita.create(parametros, { transaction: t });
    res.json(cita);
    await t.commit();
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error });
  }
});

router.get("/getCitasPaciente/:filter", authRequired, async (req, res) => {
  const { filter } = req.params;
  const whereCondition = filter === "all" ? { id: { [Op.gt]: 0 } } : { id: filter };
  const appointments = await Cita.findAll({
    include: [
      {
        attributes: ["id"],
        model: DocPac,
        required: true,
        include: [
          {
            model: Paciente,
            required: true,
            include: [
              {
                attributes: ["Correo"],
                model: User,
                required: true,
                where: { id: req.user.id },
              },
            ],
          },
          {
            model: Doctor,
            required: true,
            where: whereCondition,
            include: [
              {
                attributes: ["Correo"],
                model: User,
                required: true,
              },
            ],
          },
        ],
      },
      {
        model: CancelacionCita,
        required: false,
      }
    ],
  });
  res.status(200).json(appointments);
});

router.get("/getCitas/:filter", authRequired, async (req, res) => {
  const { filter } = req.params;
  const whereCondition = filter === "all" ? { id: { [Op.gt]: 0 } } : { id: filter };
  const appointments = await Cita.findAll({
    include: [
      {
        attributes: ["id"],
        model: DocPac,
        required: true,
        include: [
          {
            model: Paciente,
            required: true,
            where: whereCondition,
            include: [
              {
                attributes: ["Correo"],
                model: User,
                required: true,
              },
            ],
          },
          {
            model: Doctor,
            required: true,
            where: { id: req.user.idDoctor },
            include: [
              {
                attributes: ["Correo"],
                model: User,
                required: true,
                where: { idClinica: req.user.idClinica },
              },
            ],
          },
        ],
      },
      {
        model: CancelacionCita,
        required: false,
      }
    ],
  });
  res.status(200).json(appointments);
});

router.get("/getCitasAdmin/:filter", authRequired, async (req, res) => {
  const { filter } = req.params;
  const whereCondition = filter === "all" ? { id: { [Op.gt]: 0 } } : { id: filter };
  const appointments = await Cita.findAll({
    include: [
      {
        attributes: ["id"],
        model: DocPac,
        required: true,
        include: [
          {
            model: Paciente,
            required: true,
            include: [
              {
                attributes: ["Correo"],
                model: User,
                required: true,
              },
            ],
          },
          {
            model: Doctor,
            required: true,
            where: whereCondition,
            include: [
              {
                attributes: ["Correo"],
                model: User,
                required: true,
                where: { idClinica: req.user.idClinica },
              },
            ],
          },
        ],
      },
      {
        model: CancelacionCita,
        required: false,
      }
    ],
  });

  res.status(200).json(appointments);
});

router.get("/getValidCitas/:fecha", authRequired, async (req, res) => {
  const { fecha } = req.params;
  const whereCondition = req.user.is_admin ? { idDoctor: { [Op.gt]: 0 } } : req.user.idDoctor;
  const appointments = await Cita.findAll({
    where: {
      Estado: true, Fecha: {
        [Op.gt]: fecha
      }
    },
    include: [
      {
        attributes: ["id"],
        model: DocPac,
        where: whereCondition,
        include: [
          {
            model: Paciente,
            required: true,
            include: [
              {
                attributes: ["Correo"],
                model: User,
                required: true,
              },
            ],
          },
          {
            model: Doctor,
            required: true,
            include: [
              {
                attributes: ["Correo"],
                model: User,
                required: true,
                where: { idClinica: req.user.idClinica },
              },
            ],
          },
        ],
      },
    ],
  });

  res.status(200).json(appointments);
});

router.post("/cancelCita", authRequired, async (req, res) => {
  const { id, Motivo } = req.body;
  const { is_doctor, is_admin } = req.user;

  const t = await sequelize.transaction();

  try {
    const cita = await Cita.findOne({ where: { id } });

    if (!cita) return res.status(404).json({ message: "Cita not found" });

    const citaCancelada = await CancelacionCita.findOne({ where: { idCita: cita.id } });

    if (citaCancelada && citaCancelada.Pendiente === true) {
      await CancelacionCita.update({ Pendiente: false }, { where: { idCita: cita.id }, transaction: t });
    } else {
      const cancelacionPayload = {
        idCita: cita.id,
        Motivo,
        Pendiente: (is_admin || is_doctor ? false : true)
      };

      await CancelacionCita.create(cancelacionPayload, { transaction: t });
    }

    const payload = {
      Estado: (is_admin || is_doctor ? false : true)
    };

    await Cita.update(payload, { where: { id: cita.id }, transaction: t });
    res.status(200).json(cita);
    await t.commit();
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error });
  }
});

router.post("/cancelConfirmCita", authRequired, async (req, res) => {
  const { idCita } = req.body;

  const t = await sequelize.transaction();

  try {
    const cita = await Cita.findOne({ where: { id: idCita } });

    if (!cita) return res.status(404).json({ message: "Cita not found" });

    const citaCancelada = await CancelacionCita.findOne({ where: { idCita } });

    if (!citaCancelada) return res.status(404).json({ message: "Cancelacion not found" });

    if (citaCancelada.Pendiente === false) return res.status(400).json({ message: "La cita ya fue cancelada" });

    await CancelacionCita.update({ Pendiente: false }, { where: { idCita }, transaction: t });

    await Cita.update({ Estado: false }, { where: { id: cita.id }, transaction: t });

    res.status(200).json(cita);
    await t.commit();
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error });
  }
});

router.put("/editCita", authRequired, async (req, res) => {
  const { id, Fecha, Diagnostico } = req.body;

  const t = await sequelize.transaction();

  try {
    const citaAgendada = await Cita.findOne({ where: { Fecha, Estado: true }, include: [{ model: DocPac, where: { idDoctor: req.user.idDoctor }, include: [{ model: Paciente, required: true }] }] });

    if (citaAgendada) {
      return res.status(400).json({ message: `Ya tiene agendada una cita con ${citaAgendada.DocPac.Paciente.Nombre} ${citaAgendada.DocPac.Paciente.ApellidoP}` });
    }

    const cita = await Cita.findOne({ where: { id } });

    if (!cita) return res.status(404).json({ message: "Cita not found" });

    await Cita.update({ Fecha, Diagnostico }, { where: { id } });

    //Si estaba pendiente de cancelacion, eliminar la referencia

    const citaCancelada = await CancelacionCita.findOne({ where: { idCita: cita.id } });

    if (citaCancelada) {
      await CancelacionCita.destroy({ where: { idCita: cita.id }, transaction: t });
    }

    await t.commit();
    res.status(200).json(cita);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error });
  }
});

// Handle Especialidades

router.get("/getEspecialidades", authRequired, async (req, res) => {
  const especialidades = await Especialidad.findAll({
    attributes: ["Nombre"],
  });

  res.status(200).json(especialidades);
});

// Hanfle Historial Clinico

router.put("/editHistoriaMedica/:idHM", authRequired, async (req, res) => {
  const { idHM } = req.params;
  const { ...parametros } = req.body;

  const historiaMedica = await HistoriaMedica.findOne({
    where: { id: idHM },
  });

  if (!historiaMedica)
    return res.status(404).send({ message: "Historia medica not found" });

  const updatedHistoriaMedica = await HistoriaMedica.update(parametros, {
    where: { id: idHM },
  });

  res.status(200).send(updatedHistoriaMedica);
});

router.put("/editExamenFisico/:idEF", authRequired, async (req, res) => {
  const { idEF } = req.params;
  const { ...parametros } = req.body;

  const examenFisico = await ExamenFisico.findOne({
    where: { id: idEF },
  });

  if (!examenFisico)
    return res.status(404).send({ message: "ExamenF fisico not found" });

  const updatedExamenFisico = await ExamenFisico.update(parametros, {
    where: { id: idEF },
  });

  res.status(200).send(updatedExamenFisico);
});

router.post("/addHistoriaClinicaActual", authRequired, async (req, res) => {
  const { ...parametros } = req.body;

  const historiaClinicaActual = await HistoriaClinicaActual.create(
    parametros
  );

  res.status(200).json(historiaClinicaActual);
});

router.get("/getHistoriaClinicaActual/:idHC", authRequired, async (req, res) => {
  const { idHC } = req.params;

  const historiaClinicaActual = await HistoriaClinicaActual.findOne({
    where: { id: idHC },
  });

  res.status(200).json(historiaClinicaActual);
});

//Handle clincia

router.get("/getClinica", authRequired, async (req, res) => {
  const clinica = await Clinica.findOne({
    where: { id: req.user.idClinica },
    attributes: {
      exclude: ["idDomicilio", "createdAt", "updatedAt"],
    },
    include: [
      {
        model: User,
        attributes: ["Correo", "idClinica"],
        required: true,
      },
      {
        model: Domicilio,
        required: false,
        attributes: {
          exclude: ["id", "createdAt", "updatedAt"],
        },
      },
    ],
  });
  res.status(200).json(clinica);
});

router.put("/editClinica", authRequired, async (req, res) => {

  const { ...parametros } = req.body;

  const t = await sequelize.transaction();

  try {
    const clinica = await Clinica.findOne({ where: { id: req.user.idClinica } });

    if (!clinica) return res.status(404).send({ message: "Clinica not found" });

    await Clinica.update(parametros.clinicaPayload, { where: { id: req.user.idClinica }, transaction: t });

    //Verificar si el numero de telefono ya esta en uso
    const telefonoExists = await Domicilio.findOne({
      where: { Telefono: parametros.domicilioPayload.Telefono },
    });

    if (telefonoExists) {
      await t.rollback();
      return res.status(400).json({ message: "El numero de telefono ya esta en uso" });
    }

    if (clinica.idDomicilio) {
      await Domicilio.update(parametros.domicilioPayload, { where: { id: clinica.idDomicilio }, transaction: t });
    } else {
      const domicilio = await Domicilio.create(parametros.domicilioPayload, { transaction: t });
      await Clinica.update({ idDomicilio: domicilio.id }, { where: { id: req.user.idClinica }, transaction: t });
    }

    await t.commit();

    res.status(200).json({ message: "Clinica actualizada" });

  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error });
  }

});

//Handle Recetas

router.post("/addReceta", authRequired, async (req, res) => {
  const { ...parametros } = req.body;

  const t = await sequelize.transaction();
  try {
    const firma = parametros.Firma;

    //Verificar la contraseña del doctor
    const doctor = await Doctor.findOne({
      where: { id: req.user.idDoctor },
      include: [{ model: User }],
    });
    const isPasswordValid = await bcrypt.compare(
      firma,
      doctor.User.Password
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "La contraseña es invalida" });
    }

    //Obtener la relacion de docpac
    const docpac = await DocPac.findOne({
      where: { idDoctor: req.user.idDoctor, idPaciente: parametros.idPaciente },
    });

    //Obtener la historia clinica actual
    const historiaClinicaActual = await HistoriaClinicaActual.findOne({
      where: { id: parametros.idHistoriaClinicaActual },
    });

    //Crear la receta
    const receta = await Receta.create(
      {
        idDocPac: docpac.id,
        idHistoriaClinicaActual: historiaClinicaActual.id,
        Fecha_inicio: parametros.Fecha_inicio,
        Fecha_fin: parametros.Fecha_fin,
        Indicaciones: parametros.Indicaciones,
      }
      , { transaction: t });

    //Guardar todos los medicamentos
    const medicamentos = parametros.Medicamentos.map((medicamento) => {
      medicamento.idReceta = receta.id;
      return medicamento;
    });

    await Medicamento.bulkCreate(medicamentos, { transaction: t });

    await t.commit();
    res.status(200).json({ recipe: receta.id });

  } catch (error) {
    console.log(error);
    await t.rollback();
    res.status(500).json({ message: error });
  }
});

//Handle PDF
router.get("/generatePDF", async (req, res) => {
  const inputPath = path.join(__dirname, "../files/FormatoReceta.docx");
  const outputPath = path.join(__dirname, "../files/FormatoReceta.pdf");

  const convertToPDF = async () => {
    const pdfdoc = await PDFNet.PDFDoc.create();
    await pdfdoc.initSecurityHandler();
    await PDFNet.Convert.toPdf(pdfdoc, inputPath);
    pdfdoc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
  }

  PDFNet.runWithCleanup(convertToPDF, process.env.PDF_KEY).then(() => {
    PDFNet.shutdown();
    res.download(outputPath);
  }).catch((err) => {
    console.log(err);
    PDFNet.shutdown();
    res.status(500).json({ message: err });
  });
});

router.get("/recipePDF/:idReceta", async (req, res) => {
  const { idReceta } = req.params;
  const inputPath = path.join(__dirname, "../files/FormatoReceta.pdf");
  const outputPath = path.join(__dirname, "../files/Receta.pdf");

  const receta = await Receta.findOne({
    where: { id: idReceta },
    include: [
      {
        model: DocPac,
        required: true,
        include: [
          {
            model: Doctor,
            required: true,
            include: [
              {
                model: User,
                required: true,
              },
            ],
          },
          {
            model: Paciente,
            required: true,
            include: [
              {
                model: User,
                required: true,
              },
            ],
            include: [
              {
                model: HistorialClinico,
                required: true,
              },
            ],
          },
        ],
      },
      {
        model: HistoriaClinicaActual,
        required: true,
      },
      {
        model: Medicamento,
        required: true,
      }
    ],
  });

  if (!receta) {
    return res.status(404).json({ message: "Receta not found" });
  }

  const clinica = await Clinica.findOne({
    include: [
      {
        model: User,
        required: true,
        where: { id: receta.DocPac.Doctor.User.id },
      },
      {
        model: Domicilio,
        required: true,
      }
    ],
  });

  const nombreDoctor = `${receta.DocPac.Doctor.Nombre} ${receta.DocPac.Doctor.ApellidoP} ${receta.DocPac.Doctor.ApellidoM}`;
  const nombrePaciente = `${receta.DocPac.Paciente.Nombre} ${receta.DocPac.Paciente.ApellidoP} ${receta.DocPac.Paciente.ApellidoM}`;

  const medicamentos = receta.Medicamentos.map(
    (medicamento) => {
      return {
        Medicamento: medicamento.Nombre,
        Dosis: medicamento.Dosis,
        Frecuencia: medicamento.Frecuencia,
        Administracion: medicamento.Via_administracion,
      };
    }
  );

  const domicilioClinica = `${clinica.Domicilio.Calle} ${clinica.Domicilio.Num_ext} ${clinica.Domicilio.Colonia} ${clinica.Domicilio.Municipio} ${clinica.Domicilio.Estado} ${clinica.Domicilio.CP}`;
  const edadPaciente = moment().diff(receta.DocPac.Paciente.Fecha_nacimiento, 'years');

  const data = {
    idReceta: receta.id,
    nombreClinica: clinica.Nombre,
    direccionClinica: domicilioClinica,
    nombreDoctor,
    especialidad: receta.DocPac.Doctor.Especialidad,
    cedula: receta.DocPac.Doctor.Cedula,
    nombrePaciente,
    edadPaciente: edadPaciente.toString(),
    sexo: receta.DocPac.Paciente.Genero,
    idHistorialClinico: receta.DocPac.Paciente.HistorialClinico.id,
    diagnostico: receta.HistoriaClinicaActual.Motivo_consulta,
    sintomas: receta.HistoriaClinicaActual.Sintomas,
    indicaciones: receta.Indicaciones,
    medicamentos,
    fecha_inicio: receta.Fecha_inicio,
    fecha_fin: receta.Fecha_fin,
  };

  const convertToPDF = async () => {
    const pdfdoc = await PDFNet.PDFDoc.createFromFilePath(inputPath);
    await pdfdoc.initSecurityHandler();
    const replacer = await PDFNet.ContentReplacer.create();
    const page = await pdfdoc.getPage(1);

    await replacer.addString("idR", data.idReceta.toString());
    await replacer.addString("NombreClinica", data.nombreClinica);
    await replacer.addString("DireccionClinica", data.direccionClinica);
    await replacer.addString("NombreDoctor", data.nombreDoctor);
    await replacer.addString("Especialidad", data.especialidad);
    await replacer.addString("Cedula", data.cedula);
    await replacer.addString("NombrePaciente", data.nombrePaciente);
    await replacer.addString("idH", data.idHistorialClinico.toString());
    await replacer.addString("Edad", data.edadPaciente);
    await replacer.addString("Genero", data.sexo);
    await replacer.addString("Motivo_consulta", data.diagnostico);
    await replacer.addString("Sintomas", data.sintomas);
    await replacer.addString("Indicaciones", data.indicaciones);
    await replacer.addString("Fecha_inicio", data.fecha_inicio);
    await replacer.addString("Fecha_fin", data.fecha_fin);

    for (let i = 0; i < data.medicamentos.length; i++) {
      await replacer.addString(`Medicamento${i}`, data.medicamentos[i].Medicamento);
      await replacer.addString(`Instrucciones${i}`, `Tomar ${data.medicamentos[i].Dosis} cada ${data.medicamentos[i].Frecuencia} vía ${data.medicamentos[i].Administracion}`);
    }

    for (let i = data.medicamentos.length; i < 13; i++) {
      await replacer.addString(`Medicamento${i}`, "");
      await replacer.addString(`Instrucciones${i}`, "");
    }

    await replacer.process(page);
    pdfdoc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
  }

  PDFNet.runWithCleanup(convertToPDF, process.env.PDF_KEY).then(() => {
    res.setHeader('Content-Type', 'application/pdf');
    res.end(fs.readFileSync(outputPath), 'binary');
  }).catch((err) => {
    console.log(err);
    PDFNet.shutdown();
    res.status(500).json({ message: err });
  })
});


export default router;
