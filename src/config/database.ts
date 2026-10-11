import mongoose from "mongoose";
import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDb = async () => {
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
};

export default connectDb;
