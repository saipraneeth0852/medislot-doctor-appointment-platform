import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      memoryServer = await MongoMemoryServer.create({
        instance: { dbName: "appointy" },
      });
      mongoUri = memoryServer.getUri();
      console.log("Using in-memory MongoDB for local development");
    }

    const dbUri = mongoUri.endsWith("/appointy") ? mongoUri : `${mongoUri}/appointy`;
    await mongoose.connect(dbUri);
    console.log("Database Connected");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
