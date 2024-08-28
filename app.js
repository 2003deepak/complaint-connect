require("dotenv").config();  // Load environment variables at the very top

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');    
const expressSession = require('express-session');
const flash = require('connect-flash');                        
const db = require('./config/mongoose-connection');
const upload = require('./config/multer-config');
const setRoleBasedOnRoute = require('./utils/setRoleBasedRoute');
const app = express();

// Routes Import 
const indexRouter = require('./routes/indexRouter');
const contractorRouter = require('./routes/contractorRouter');
const workerRouter = require('./routes/workerRouter');
const adminRouter = require('./routes/adminRouter');
const userRouter = require('./routes/userRouter');

// Middleware to parse JSON request bodies                                                      
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(setRoleBasedOnRoute);

// It is used to set session and to display flash messages
app.use(
    expressSession({
        secret: process.env.SESSION_SECRET,  // Ensure this is set correctly
        resave: false,
        saveUninitialized: false,
    })
);

app.use(flash());

// Setting EJS as View Engine 
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

// Routes
app.use("/", indexRouter);
app.use("/contractor", contractorRouter);
app.use("/worker", workerRouter);
app.use("/admin", adminRouter);
app.use("/user", userRouter);

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
