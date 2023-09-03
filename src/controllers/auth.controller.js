import Doctor from "../models/doctor.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../libs/jwt.js";

export const signup = async (req, res) => {
  const { ...parametros } = req.body;
  try {
    const passwordHash = await bcrypt.hash(parametros.Password, 10);
    parametros.Password = passwordHash;

    const doctor = await Doctor.create(parametros);

    const token = await generateToken({
      email: doctor.Correo,
      id: doctor.Id_Doctor,
    });

    res.cookie("token", token);
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.errors[0].message });
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

    res.cookie("token", token);
    res.json(doctorFound);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = (req, res) => {
  res.status(200).send(req.user);
};
