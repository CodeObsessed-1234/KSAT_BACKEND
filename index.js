const connectDB = require("./config/mongoose");
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

require("dotenv").config();

app.use(cors());
app.use(express.json());


const auth_route = require("./routes/auth_route");
const farmer_route = require("./routes/farmer_route");
const indivisual_transporter_route = require("./routes/indivisual_transporter_route");

// Middleware to parse JSON bodies
app.use(express.json());

// routes
app.use("/api/auth", auth_route);
app.use("/api/farmer",farmer_route);
app.use("/api/indivisual_transporter",indivisual_transporter_route);
// app.use("/api/middleman");
// app.use("/api/admin");
// app.use("/api/retailer");
// app.use("/api/customer");

// Start the server
connectDB()
  .then(() => {
    console.log("Connected to the database");
    app.listen(PORT, () => {
      console.log(`Server is running at PORT:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
