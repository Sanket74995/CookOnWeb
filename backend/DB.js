const mongoose = require("mongoose");

const DEFAULT_URI = "mongodb://127.0.0.1:27017/cookonweb";

const getMongoUri = () => {
    const configuredUri = process.env.MONGODB_URI || DEFAULT_URI;
    return configuredUri.replace("localhost", "127.0.0.1");
};

const connectDB = async () => {
    const mongoUri = getMongoUri();

    try {
        await mongoose.connect(mongoUri);
        console.log(`Connected to MongoDB: ${mongoUri}`);
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        console.error(
            "Verify that the MongoDB service is running locally or set MONGODB_URI to a reachable database."
        );
        process.exit(1);
    }
};

module.exports = connectDB;
