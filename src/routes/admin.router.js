import express from "express";
const router = express.Router();

import bcrypt from "bcryptjs";
import { authRequired } from "../middlewares/validateToken.js";

import Admin from "../models/admin.js";
import Doctor from "../models/doctor.js";
import Paciente from "../models/paciente.js";

router.get("/", async (req, res) => {
  const admins = await Admin.findAll();
  res.status(200).send(JSON.stringify(admins, null, 2));
});

// Handle doctors

router.post("/addDoctor", authRequired, async (req, res) => {
  const { ...parametros } = req.body;
  try {
    const passwordHash = await bcrypt.hash(parametros.Password, 10);
    parametros.Password = passwordHash;

    const doctor = await Doctor.create(parametros);

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/getDoctors", authRequired, async (req, res) => {
  const doctors = await Doctor.findAll();
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
    where: { Id_Doctor: doctor.Id_Doctor },
  });
  res.status(200).send(updatedDoctor);
});

router.delete("/deleteDoctor/:idDoc", authRequired, async (req, res) => {
  const { idDoc } = req.params;
  const doctor = await Doctor.findByPk(idDoc);
  if (!doctor) return res.status(404).send({ message: "Doctor not found" });
  await doctor.destroy();
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

export default router;
