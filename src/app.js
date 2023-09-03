import express from "express";
import morgan from 'morgan'
import router from "./routes/router.js";
import cookieParser from 'cookie-parser'

const app = express();

app.use(morgan('dev'))

app.use(express.json())
app.use(cookieParser())

app.use(router)

export default app