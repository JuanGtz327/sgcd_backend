import express from "express";
import { Sequelize } from "sequelize";
const router = express.Router();

import bcrypt from "bcryptjs";
import { authRequired } from "../middlewares/validateToken.js";

import Admin from "../models/admin.js";
import User, { Doctor } from "../models/user.js";
import Paciente from "../models/paciente.js";
import Cita from "../models/cita.js";

router.get("/", async (req, res) => {
  const admins = await Admin.findAll();
  res.status(200).send(JSON.stringify(admins, null, 2));
});

// Handle doctors

router.post("/addDoctor", authRequired, async (req, res) => {
  const { ...parametros } = req.body;
  const { idClinica } = req.user;
  try {
    const userExists = await User.findOne({
      where: { Correo: parametros.Correo },
    });
    if (userExists)
      return res
        .status(400)
        .json({ message: "La direccion de correo ya esta en uso" });

    //Guardar el doctor en la tabla de doctores

    const doctorPayload = {
      Nombre: parametros.Nombre,
      ApellidoM: parametros.ApellidoM,
      ApellidoP: parametros.ApellidoP,
      Especialidad: parametros.Especialidad,
      Cedula: parametros.Cedula,
    };

    const doctor = await Doctor.create(doctorPayload);

    //Guardar el doctor en la tabla de usuarios

    const passwordHash = await bcrypt.hash(parametros.Password, 10);

    const userPayload = {
      Correo: parametros.Correo,
      Password: passwordHash,
      idClinica: idClinica,
      id: doctor.id,
    };

    await User.create(userPayload);

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/getDoctors", authRequired, async (req, res) => {
  const doctors = await Doctor.findAll({
    include: [
      {
        model: User,
        attributes: ["Correo"],
        where: {
          id: Sequelize.col("Doctor.id"),
          idClinica: req.user.idClinica,
        },
        required: true,
      },
    ],
  });
  res.status(200).json(doctors);
});

router.get("/getDoctor/:idDoc", authRequired, async (req, res) => {
  const { idDoc } = req.params;
  if (!idDoc)
    return res.status(400).send({ message: "You must provide an Id_Doctor" });
  const doctor = await Doctor.findByPk(idDoc);
  if (!doctor) return res.status(404).send({ message: "Doctor not found" });
  res.status(200).json(doctor);
});

router.put("/editDoctor/:idDoc", authRequired, async (req, res) => {
  const { ...parametros } = req.body;
  const { idDoc } = req.params;
  if (!idDoc)
    return res.status(400).send({ message: "You must provide an Id_Doctor" });
  const doctor = await Doctor.findByPk(idDoc);
  if (!doctor) return res.status(404).send({ message: "Doctor not found" });
  const updatedDoctor = await Doctor.update(parametros, {
    where: { id: doctor.id },
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

    const user = await User.findOne({ where: { id: doctor.id } });
    if (!user) return res.status(404).send({ message: "User not found" });
    await User.update(
      { Correo: parametros.Correo },
      { where: { id: user.id } }
    );
  }

  if (parametros.Password) {
    const passwordHash = await bcrypt.hash(parametros.Password, 10);
    const user = await User.findOne({ where: { id: doctor.id } });
    if (!user) return res.status(404).send({ message: "User not found" });
    await User.update(
      { Password: passwordHash },
      { where: { id: user.id } }
    );
  }


  res.status(200).send(updatedDoctor);
});

router.delete("/deleteDoctor/:idDoc", authRequired, async (req, res) => {
  const { idDoc } = req.params;

  const doctor = await Doctor.findByPk(idDoc);
  if (!doctor) return res.status(404).send({ message: "Doctor not found" });
  await doctor.destroy();

  const user = await User.findOne({ where: { id: idDoc } });
  if (!user) return res.status(404).send({ message: "User not found" });
  await user.destroy();

  res.status(200).json({ message: `Doctor ${idDoc} deleted` });
});

// Handle Patients

router.post("/addPatient", authRequired, async (req, res) => {
  const { ...parametros } = req.body.Patient;
  const { id } = req.user;
  try {
    const passwordHash = await bcrypt.hash(parametros.Password, 10);
    parametros.Password = passwordHash;
    parametros.Id_Doctor = id;

    const patient = await Paciente.create(parametros);

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/getPatients", authRequired, async (req, res) => {
  const patients = await Paciente.findAll();
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
  const patient = await Paciente.findByPk(idPat);
  if (!patient) return res.status(404).send({ message: "Patient not found" });
  const updatedPatient = await Paciente.update(parametros.Patient, {
    where: { Id_Paciente: patient.Id_Paciente },
  });
  res.status(200).send(updatedPatient);
});

router.delete("/deletePatient/:idPat", authRequired, async (req, res) => {
  const { idPat } = req.params;
  const patient = await Paciente.findByPk(idPat);
  if (!patient) return res.status(404).send({ message: "Patient not found" });
  await patient.destroy();
  res.status(200).json({ message: `Patient ${idPat} deleted` });
});

// Handle Citas

router.post("/addCita", authRequired, async (req, res) => {
  const { ...parametros } = req.body;
  const { id } = req.user;
  try {
    parametros.Id_Doctor = id;
    const cita = await Cita.create(parametros);

    res.json(cita);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/getCitas", authRequired, async (req, res) => {
  const appointments = await Cita.findAll();
  res.status(200).json(appointments);
});

export default router;
