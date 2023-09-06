import express from 'express'
const router = express.Router();

import {authRequired} from '../middlewares/validateToken.js'

router.get('/', authRequired ,async (req,res) => {
    res.status(200).send('Pacientes');
})

export default router;