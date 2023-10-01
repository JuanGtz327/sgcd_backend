import express from "express";
const router = express.Router();
import sequelize from "../db.js";

import bcrypt from "bcryptjs";
import { authRequired } from "../middlewares/validateToken.js";

import User, {
  Doctor,
  Paciente,
  DocPac,
  Cita,
  Especialidad,
  Domicilio,
  Clinica,
  HistoriaMedica,
  ExamenFisico,
  HistoriaClinicaActual,
  HistorialClinico,
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
          }
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
        required: true,
      },
    ],
  });
  res.json(a);
});

router.get("/pruebapacientes", async (req, res) => {
  const a = await Paciente.findAll({
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
                attributes: ["Correo","idClinica"],
                required: true,
              },
            ],
          },
        ],
      },
      {
        model: User,
        attributes: ["Correo","idClinica"],
        where: { idClinica: 1 },
        required: true,
      },
      {
        model: Domicilio,
        required: true,
      }
    ],
  });
  res.json(a);
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

    const domicilio = await Domicilio.create(domicilioPayload, { transaction: t });

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
  const doctors = await User.findAll({
    where: { is_doctor: true, idClinica: req.user.idClinica },
    attributes: ["Correo"],
    include: [
      {
        model: Doctor,
        required: true,
        attributes: [
          "Nombre",
          "ApellidoP",
          "ApellidoM",
          "CURP",
          "Cedula",
          "Especialidad",
          "idUser",
        ],
        include: [
          {
            model: Domicilio,
            required: true,
            attributes: [
              "Calle",
              "Num_ext",
              "Num_int",
              "Estado",
              "Municipio",
              "Colonia",
              "CP",
              "Telefono",
            ],
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
  } = req.body;
  console.log(req.body);

  const { idClinica, idDoctor } = req.user;
  const t = await sequelize.transaction();
  try {
    if (!idDoctor)
      return res.status(400).send({ message: "You must provide an Id_Doctor" });

    const userExists = await User.findOne({
      where: { Correo: Correo },
    });
    if (userExists)
      return res
        .status(400)
        .json({ message: "La direccion de correo ya esta en uso" });

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

    await DocPac.create(docPacPayload, {transaction: t});

    //Guardar historial clinico paciente
    const historiaMedica = await HistoriaMedica.create(historiaMedicaPayload, {
      transaction: t,
    });
    const examenFisico = await ExamenFisico.create(examenFisicoPayload, {
      transaction: t,
    });
    const historiaClinicaActual = await HistoriaClinicaActual.create(
      historiaClinicaActualPayload,
      { transaction: t }
    );

    const historial_clinico_payload = {
      idPaciente: patient.id,
      idHistoriaMedica: historiaMedica.id,
      idExamenFisico: examenFisico.id,
      idHistoriaClinicaActual: historiaClinicaActual.id
    };

    const historial_clinico = await HistorialClinico.create(
      historial_clinico_payload,
      { transaction: t }
    );
    await t.commit();
    res.json(historial_clinico);
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(500).json({ message: error });
  }
});

router.get("/getPatients", authRequired, async (req, res) => {
  const patients = await User.findAll({
    where: { is_doctor: false, idClinica: req.user.idClinica },
    attributes: ["Correo"],
    include: [
      {
        model: Paciente,
        required: true,
        include: [
          {
            model: DocPac,
            where: { idDoctor: req.user.idDoctor },
            required: true,
          },
        ],
      },
    ],
  });
  res.status(200).json(patients);
});

router.get("/getPatient/:idPat", authRequired, async (req, res) => {
  const { idPat } = req.params;
  if (!idPat)
    return res.status(400).send({ message: "You must provide an Id_Paciente" });
  const patient = await Paciente.findByPk(idPat);
  if (!patient) return res.status(404).send({ message: "Patient not found" });
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
  try {
    const cita = await Cita.create(parametros);
    res.json(cita);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/getCitas", authRequired, async (req, res) => {
  const appointments = await Cita.findAll({
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

// Handle Especialidades

router.get("/getEspecialidades", authRequired, async (req, res) => {
  const especialidades = await Especialidad.findAll({
    attributes: ["Nombre"],
  });

  res.status(200).json(especialidades);
});

export default router;
