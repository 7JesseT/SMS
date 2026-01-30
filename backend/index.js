const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const app = express()
const Routes = require("./routes/route.js")

dotenv.config();

const PORT = process.env.PORT || 10000
const MONGO_URI = process.env.MONGO_URI

// Validate environment variables
if (!MONGO_URI) {
    console.error("ERROR: MONGO_URI environment variable is not set!")
    process.exit(1)
}

app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'http://localhost:3000',
        'http://localhost:5174',
        'https://sms-15wv.onrender.com',
        'https://school-management-7b79f.web.app',
        'https://school-management-7b79f.firebaseapp.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Connect to MongoDB
mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch((err) => {
        console.error("❌ Failed to connect to MongoDB:", err.message)
        process.exit(1)
    })

app.use('/', Routes);

app.listen(PORT, () => {
    console.log(`✅ Server started at port ${PORT}`)
    console.log(`📡 API ready: http://localhost:${PORT}`)
})