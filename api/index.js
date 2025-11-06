import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ MONGO_URI is not defined in .env");
  process.exit(1); // stop here
}

const app = express();

app.use(express.json()); // if you will parse JSON later

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    dbName: "real-estate", // you can specify this, or ensure in URI
  })
  .then(() => {
    console.log("✅ MongoDB Connected");

    // Start the server only after successful DB connect
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Example route
app.get("/", (req, res) => {
  res.send("API is running...");
});
