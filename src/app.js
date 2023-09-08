import express from "express";
import morgan from 'morgan'
import router from "./routes/router.js";
import adminRouter from './routes/admin.router.js'
import doctorRouter from './routes/doctor.router.js'
import pacienteRouter from './routes/paciente.router.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express();

app.use(cors({
    origin: process.env.FRONT_URL || 'http://localhost:5173',
}))

app.use(morgan('dev'))

app.use(express.json())
app.use(cookieParser())

app.use(router)
app.use('/admin',adminRouter)
app.use('/doctor',doctorRouter)
app.use('/paciente',pacienteRouter)

export default app