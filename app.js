import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import MongoDBStore from "connect-mongodb-session";
import flash from "connect-flash";
import csrf from "@dr.pogodin/csurf";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import shopRoutes from "./routes/shop.js";
import User from "./models/user.js";


const csrfProtection = csrf();
const MongoDBStoreSession = MongoDBStore(session);

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

app.use(express.static("public")); // Serve static files from /public

app.set("view engine", "ejs"); // Set EJS as the templating engine
app.set("views", "./views"); // Set the directory for views (optional) //* ./views is relative to the working directory

dotenv.config();

// Connect to MongoDB using the URI from environment variables
mongoose.connect(process.env.MONGODB_URI);

const store = new MongoDBStoreSession({
    uri: process.env.MONGODB_URI,
    collection: "sessions",
});

app.use(
    session({
        secret: "my secret",
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

app.use(flash());
app.use(csrfProtection);


app.use((req, res, next) => {
  if (!req.session.user) { // not logged in
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;  // attach the user on req
      next();
    })
    .catch(err => {
      throw new Error(err);
    });
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    //~ Set local variables for this specific request.
    //~ These values will be accessible in the template rendered by res.render().
    next();
});

app.use("/admin", adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);

// Root route redirect
app.get("/", (req, res) => {
    res.redirect("/products");
});

// CSRF error handler
app.use((error, req, res, next) => {
    if (error.code === 'EBADCSRFTOKEN') {
        res.status(403).render('error', {
            pageTitle: 'Forbidden',
            message: 'Invalid CSRF token. Please try again.'
        });
    } else {
        next(error);
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).render("error", {
        pageTitle: "404 Not Found",
        message: "Page not found",
    });
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
