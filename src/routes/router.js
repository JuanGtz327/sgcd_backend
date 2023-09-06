import express from "express";
const router = express.Router();

import {login,signup,logout,profile} from '../controllers/auth.controller.js'

router.get("/", async (req, res) => {
  res.status(200).send(`Hello World from SGCD`)
});

router.post("/login",login);
router.post("/signup",signup);
router.post("/logout",logout);

export default router;
