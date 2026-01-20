const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
// const bodyParser = require("body-parser")
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

// app.use(bodyParser.json({ limit: '10mb', extended: true }))
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use(express.json({ limit: '10mb' }))
app.use(cors())

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