import express from "express";
const router = express.Router();

import bcrypt from "bcryptjs";
import { authRequired } from "../middlewares/validateToken.js";

import User, { Doctor, Paciente, DocPac } from "../models/models.js";
import Cita from "../models/cita.js";

router.get("/", async (req, res) => {});

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

    //Guardar el doctor en la tabla de usuarios

    const passwordHash = await bcrypt.hash(parametros.Password, 10);

    const userPayload = {
      Correo: parametros.Correo,
      Password: passwordHash,
      idClinica: idClinica,
    };

    const user = await User.create(userPayload);

    //Guardar el doctor en la tabla de doctores

    const doctorPayload = {
      idUser: user.id,
      Nombre: parametros.Nombre,
      ApellidoM: parametros.ApellidoM,
      ApellidoP: parametros.ApellidoP,
      Especialidad: parametros.Especialidad,
      Cedula: parametros.Cedula,
    };

    const doctor = await Doctor.create(doctorPayload);

    res.json(doctor);
  } catch (error) {
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
  const { ...parametros } = req.body;
  const { idClinica, idDoctor } = req.user;

  try {
    if (!idDoctor)
      return res.status(400).send({ message: "You must provide an Id_Doctor" });

    const userExists = await User.findOne({
      where: { Correo: parametros.Correo },
    });
    if (userExists)
      return res
        .status(400)
        .json({ message: "La direccion de correo ya esta en uso" });

    //Guardar el paciente en la tabla de usuarios

    const passwordHash = await bcrypt.hash(parametros.Password, 10);

    const userPayload = {
      Correo: parametros.Correo,
      Password: passwordHash,
      idClinica: idClinica,
      is_doctor: false,
    };

    const user = await User.create(userPayload);

    //Guardar el paciente en la tabla de pacientes

    const patientPayload = {
      idUser: user.id,
      Nombre: parametros.Nombre,
      ApellidoM: parametros.ApellidoM,
      ApellidoP: parametros.ApellidoP,
      Edad: parametros.Edad,
      Genero: parametros.Genero,
      Domicilio: parametros.Domicilio,
    };

    const patient = await Paciente.create(patientPayload);

    //Guardar las referencias en la tabla de DocPac

    const docPacPayload = {
      idDoctor,
      idPaciente: patient.id,
    };

    await DocPac.create(docPacPayload);

    res.json(patient);
  } catch (error) {
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
