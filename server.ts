import express from "express";
import dotenv from "dotenv";
import schoolRoutes from "./routes/schoolRoutes";

dotenv.config();

const app = express();
app.use(express.json()); // Ensure this is before defining routes

// Use Routes
app.use("/schools", schoolRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
