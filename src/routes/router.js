import express from "express";
const router = express.Router();

import {login,signup,logout,profile} from '../controllers/auth.controller.js'
import {authRequired} from '../middlewares/validateToken.js'

import Admin from "../models/admin.js";
import sequelize from '../db.js'

router.get("/", async (req, res) => {
  //const admins = await Admin.findAll();
  //res.status(200).send(JSON.stringify(admins,null,2));
  //res.status(200).send(`ENV ${JSON.stringify(process.env,null,2)}`);
  try {
    await sequelize.authenticate();
    return res.send("DB is connected")
  } catch (error) {
    return res.send(`BD ERROR ${error}`);
  }
  
});

router.post("/login",login);
router.post("/signup",signup);
router.post("/logout",logout);
router.get("/profile",authRequired,profile)

export default router;
