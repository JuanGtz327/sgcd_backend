import express from "express";
const router = express.Router();
import sequelize from "../db.js";
import { Op } from "sequelize";

import bcrypt from "bcryptjs";
import { authRequired } from "../middlewares/validateToken.js";

import User, {
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
} from "../models/models.js";

router.get("/refresh-db", async (req, res) => {
  try {
    await sequelize.sync({ alter: true });
    res.send("DB refreshed");
  } catch (error) {
    res.send(JSON.stringify(error));
  }
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
  const paciente = await Paciente.findOne({
    where: { id: 1 },
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
      },
    ],
  });
  return res.json(paciente);
});

// Handle doctors

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

    //Guardar el doctor en la tabla de usuarios

    const passwordHash = await bcrypt.hash(parametros.Password, 10);

    const userPayload = {
      Correo: parametros.Correo,
      Password: passwordHash,
      idClinica: idClinica,
    };

    const user = await User.create(userPayload, { transaction: t });

    //Guardar el domicilio del doctor

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
      idDomicilio: domicilio.id,
    };

    const doctor = await Doctor.create(doctorPayload, { transaction: t });

    await t.commit();

    res.json(doctor);
  } catch (error) {
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

router.put("/editDoctor/:idDoc", authRequired, async (req, res) => {
  const { ...parametros } = req.body;
  const { idDoc } = req.params;
  if (!idDoc)
    return res.status(400).send({ message: "You must provide an Id_Doctor" });

  const doctor = await Doctor.findOne({ where: { id: idDoc } });
  if (!doctor) return res.status(404).send({ message: "Doctor not found" });
  const updatedDoctor = await Doctor.update(parametros, {
    where: { id: idDoc },
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
      { where: { id: user.id } }
    );
  }

  if (parametros.Password) {
    const passwordHash = await bcrypt.hash(parametros.Password, 10);
    const user = await User.findOne({ where: { id: doctor.idUser } });
    if (!user) return res.status(404).send({ message: "User not found" });
    await User.update({ Password: passwordHash }, { where: { id: user.id } });
  }

  res.status(200).send(updatedDoctor);
});

router.delete("/deleteDoctor/:idDoc", authRequired, async (req, res) => {
  const { idDoc } = req.params;

  await User.destroy({ where: { id: idDoc } });

  res.status(200).json({ message: `Doctor ${idDoc} deleted` });
});

// Handle Patients

router.post("/addPatient", authRequired, async (req, res) => {
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

  const { idClinica, idDoctor } = req.user;
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
    await t.rollback();
    res.status(500).json({ message: error });
  }
});

router.get("/getCitas", authRequired, async (req, res) => {
  const appointments = await Cita.findAll({
    where: { Estado: true },
    include: [
      {
        attributes: ["id"],
        model: DocPac,
        where: { idDoctor: req.user.idDoctor },
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

router.get("/getValidCitas/:fecha", authRequired, async (req, res) => {
  const { fecha } = req.params;
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
        where: { idDoctor: req.user.idDoctor },
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

  const t = await sequelize.transaction();

  try {
    const cita = await Cita.findOne({ where: { id } });

    if (!cita) return res.status(404).json({ message: "Cita not found" });

    const cancelacion = await CancelacionCita.create({ idCita: cita.id, Motivo });

    await Cita.update({ Estado: false }, { where: { id } });
    await t.commit();
    res.status(200).json(cancelacion);
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

export default router;
