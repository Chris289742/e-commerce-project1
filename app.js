import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import adminRoutes from "./routes/admin.js";

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

app.use(express.static("public")); // Serve static files from /public

app.set("view engine", "ejs"); // Set EJS as the templating engine
app.set("views", "./views"); // Set the directory for views (optional) //* ./views is relative to the working directory

dotenv.config();


// Connect to MongoDB using the URI from environment variables
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
app.use("/admin", adminRoutes);



app.listen(3001);
