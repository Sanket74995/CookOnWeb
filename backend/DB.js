const mongoose = require("mongoose");

const DEFAULT_URI = "mongodb://127.0.0.1:27017/cookonweb";

let connectionPromise = null;

const getMongoUri = () => {
    const configuredUri = process.env.MONGO_URI || process.env.MONGODB_URI || DEFAULT_URI;
    return configuredUri.replace("localhost", "127.0.0.1");
};

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (connectionPromise) {
        return connectionPromise;
    }

    const mongoUri = getMongoUri();

    connectionPromise = mongoose
        .connect(mongoUri)
        .then((connection) => {
            console.log(`Connected to MongoDB: ${mongoUri}`);
            return connection;
        })
        .catch((err) => {
            connectionPromise = null;
            console.error("MongoDB connection error:", err.message);
            console.error(
                "Verify that MongoDB Atlas is reachable and set MONGO_URI or MONGODB_URI correctly."
            );
            throw err;
        });

    return connectionPromise;
};

module.exports = connectDB;
