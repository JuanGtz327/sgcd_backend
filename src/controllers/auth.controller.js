import User, { Clinica, Doctor, Paciente } from "../models/models.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { ...parametros } = req.body;
  try {
    if (!parametros.Password)
      return res.status(400).json({ message: "Contraseña no ingresada" });

    const userFound = await User.findOne({
      where: { Correo: parametros.Correo },
    });
    if (userFound)
      return res
        .status(400)
        .json({ message: "La direccion de correo ya esta en uso" });

    const passwordHash = await bcrypt.hash(parametros.Password, 10);
    parametros.Password = passwordHash;
    parametros.is_admin = true;

    //Creacion de la clinica con nombre temporal
    const clinica = await Clinica.create({
      Nombre: parametros.Correo.split("@")[0],
    });

    //Creacion del usuario con la clinica temporal
    parametros.idClinica = clinica.id;

    const user = await User.create(parametros);

    let tokenPayload = {
      email: user.Correo,
      id: user.id,
      is_admin: user.is_admin,
      is_doctor: user.is_doctor,
      idClinica: user.idClinica,
    };

    const token = await generateToken(tokenPayload);

    tokenPayload.token = token;

    res.cookie("token", token, { sameSite: "none", secure: true });
    res.json(tokenPayload);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const login = async (req, res) => {
  const { Correo, Password } = req.body;
  try {
    const userFound = await User.findOne({ where: { Correo } });

    if (!userFound) {
      res.status(400).json({ message: "Usuario no encontrado" });
      return;
    }

    const isMatch = await bcrypt.compare(Password, userFound.Password);

    if (!isMatch) {
      res.status(400).json({ message: "Contraseña incorrecta" });
      return;
    }

    let tokenPayload = {
      email: userFound.Correo,
      id: userFound.id,
      is_admin: userFound.is_admin,
      is_doctor: userFound.is_doctor,
      idClinica: userFound.idClinica,
    };

    if (userFound.is_doctor) {
      const doctorFound = await Doctor.findOne({ where: { idUser: userFound.id } });
      if (doctorFound) {
        tokenPayload.idDoctor = doctorFound.id;
      }
    }else{
      const pacienteFound = await Paciente.findOne({ where: { idUser: userFound.id } });
      if (pacienteFound) {
        tokenPayload.idPaciente = pacienteFound.id;
      }
    }

    const token = await generateToken(tokenPayload);

    tokenPayload.token = token;

    res.cookie("token", token, { sameSite: "none", secure: true });

    res.json(tokenPayload);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.sendStatus(200);
};

export const verifyToken = async (req, res) => {
  const token = req.body.token;
  if (!token) return res.status(401).json({ message: "No hay token" });

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "Token invalido" });

    const userFound = await User.findOne({
      where: { Correo: user.email },
    });

    if (!userFound) return res.status(401).json({ message: "No autorizado" });

    let userPayload = {...user}

    userPayload.token = token;

    return res.status(200).json(userPayload);
  });
};
