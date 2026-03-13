import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(uri);
    // eslint-disable-next-line no-console
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

