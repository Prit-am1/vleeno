import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const VLEENO_CLUSTER_URL = process.env.VLEENO_CLUSTER_URL;

const connectDB = async () => {
  await mongoose.connect(
    VLEENO_CLUSTER_URL
  );
};

export default connectDB;
