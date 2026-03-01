const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT;
import { startAutoCancelJob } from "./src/auto/automation";

// // routes
const commonRoutes = require("./src/routes/commonRoutes");
const userRoutes = require("./src/routes/userRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const stripRoutes = require('./src/routes/stripeRoutes')

// start corn job server automation
startAutoCancelJob()

app.use(
  cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// stripe routes - webhook payload must be provided as raw string or Buffer
app.use("/api/stripe", stripRoutes);

app.use(express.json());

// // routes apply
app.use("/api/common", commonRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

// start server
app.listen(PORT, () => {
  console.log(`Server is running on port number ${PORT}`);
});
