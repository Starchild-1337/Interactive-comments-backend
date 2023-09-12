const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const commentsRoutes = require("./routes/comments");
const authRoutes = require("./routes/auth");

const dbURI = process.env.DB_URI;
const port = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());

app.use(commentsRoutes);
app.use(authRoutes);

mongoose.connect(dbURI);
app.listen(port, () => {
  console.log("Server listening...");
});
