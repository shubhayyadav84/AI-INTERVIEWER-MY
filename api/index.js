import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/connectdb.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/userroute.js"
import interviewRouter from "./routes/interviewroute.js"
import paymentRouter from "./routes/paymentroute.js"

import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, ".env") })

const app = express()

const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",") : []

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const isLocalhost = origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:");
        if (isLocalhost || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/payment", paymentRouter)

// Connect to Database immediately when function boots
connectDb()

const PORT = process.env.PORT || process.env.port || 8000

// Only run app.listen during local development, Vercel handles the serverless execution
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running locally on port ${PORT}`)
    })
}

export default app