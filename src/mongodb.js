import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

let bucket;

const connectDB = async () => {
  try {
    
    const mongoURI = "mongodb://127.0.0.1:27017/memoriesDB"; 
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected");

    bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "memories" });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

const getBucket = () => {
  if (!bucket) throw new Error("MongoDB not connected yet");
  return bucket;
};

export { connectDB, getBucket };
