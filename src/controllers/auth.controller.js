import Doctor from "../models/doctor.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { ...parametros } = req.body;
  try {
    if (!parametros.Password)
      return res.status(400).json({ message: "Contraseña no ingresada" });

    const doctorFound = await Doctor.findOne({
      where: { Correo: parametros.Correo },
    });
    if (doctorFound)
      return res
        .status(400)
        .json({ message: "La direccion de correo ya esta en uso" });

    const passwordHash = await bcrypt.hash(parametros.Password, 10);
    parametros.Password = passwordHash;

    const doctor = await Doctor.create(parametros);

    const token = await generateToken({
      email: doctor.Correo,
      id: doctor.Id_Doctor,
    });

    res.cookie("token", token, { sameSite: "none", secure: true });
    res.json({
      id: doctor.Id_Doctor,
      email: doctor.Correo,
      name: doctor.Nombre,
      token: token,
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const login = async (req, res) => {
  const { Correo, Password } = req.body;
  try {
    const doctorFound = await Doctor.findOne({ where: { Correo } });

    if (!doctorFound) {
      res.status(400).json({ message: "Doctor no encontrado" });
      return;
    }

    const isMatch = await bcrypt.compare(Password, doctorFound.Password);

    if (!isMatch) {
      res.status(400).json({ message: "Contraseña incorrecta" });
      return;
    }

    const token = await generateToken({
      email: doctorFound.Correo,
      id: doctorFound.Id_Doctor,
    });

    res.cookie("token", token, { sameSite: "none", secure: true });

    res.json({
      id: doctorFound.Id_Doctor,
      email: doctorFound.Correo,
      name: doctorFound.Nombre,
      token: token,
    });
  } catch (error) {
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

    const userFound = await Doctor.findByPk(user.id);

    if (!userFound) return res.status(401).json({ message: "No autorizado" });

    return res.status(200).json({
      id: userFound.Id_Doctor,
      email: userFound.Correo,
      name: userFound.Nombre,
      token: token,
    });
  });
};

export const profile = (req, res) => {
  res.status(200).send(req.user);
};
