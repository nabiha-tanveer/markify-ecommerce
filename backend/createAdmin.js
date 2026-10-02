import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@markify.com";
    const exists = await User.findOne({ email });
    if (exists) {
      console.log("Admin already exists:", email);
      process.exit(0);
    }

    await User.create({
      name: "Markify Admin",
      email,
      password: "Admin@12345",
      role: "admin",
    });

    console.log("Admin created ->", email, "/ Admin@12345");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

createAdmin();