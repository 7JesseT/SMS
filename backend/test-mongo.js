// Quick MongoDB connection test
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

console.log("🧪 Testing MongoDB Connection...\n");
console.log("Connection String Details:");
console.log("  - URI provided: YES");
console.log("  - URI length:", MONGO_URI?.length || 0);

if (!MONGO_URI) {
    console.error("❌ MONGO_URI not found in .env file!");
    process.exit(1);
}

console.log("\n🔗 Attempting to connect to MongoDB Atlas...");
console.log("  - Using connection string with password encoded");

mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    })
    .then(() => {
        console.log("✅ SUCCESS! Connected to MongoDB Atlas");
        console.log("  - Database: sms");
        console.log("  - User: sms");
        
        // Get connection details
        const db = mongoose.connection;
        console.log("  - Host:", db.host);
        console.log("  - Port:", db.port);
        console.log("  - Name:", db.name);
        
        process.exit(0);
    })
    .catch((err) => {
        console.error("\n❌ FAILED to connect to MongoDB Atlas");
        console.error("Error Type:", err.name);
        console.error("Error Message:", err.message);
        
        if (err.message.includes("authentication failed")) {
            console.log("\n📌 Troubleshooting 'authentication failed' error:");
            console.log("  1. Check MongoDB Atlas -> Database Access -> Users");
            console.log("     Verify user 'sms' exists with correct password");
            console.log("  2. Check MongoDB Atlas -> Network Access -> IP Whitelist");
            console.log("     Add your IP address (or 0.0.0.0/0 for all)");
            console.log("  3. Verify cluster name: 'sms'");
            console.log("  4. Ensure password '@' is encoded as '%40' in connection string");
        }
        
        if (err.message.includes("getaddrinfo")) {
            console.log("\n📌 DNS/Network error - check internet connection");
        }
        
        process.exit(1);
    });