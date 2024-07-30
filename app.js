const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');                                  
const db = require('./config/mongoose-connection');
const upload = require('./config/multer-config');
const setRoleBasedOnRoute = require('./utils/setRoleBasedRoute');
const app = express();

// Routes Import 
const indexRouter = require('./routes/indexRouter')
const contractorRouter = require('./routes/contractorRouter')
const workerRouter = require('./routes/workerRouter')
const adminRouter = require('./routes/adminRouter')
const userRouter = require('./routes/userRouter')

// Models Import 
const userModel = require("./models/user")
const complaintModel = require("./models/complaint")
const workerModel = require("./models/worker")
const workerActionModel = require("./models/workerAction")
const closedComplaintModel = require("./models/closedComplaint")
const priorityComplaintModel = require("./models/priorityComplaint")

// Middleware to parse JSON request bodies                                                      
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(setRoleBasedOnRoute);


// Setting EJS as View Engine 
app.set("view engine", "ejs");

// Load environment variables from .env file and can be used by process.env
require("dotenv").config();

// Routes
app.use("/", indexRouter);
app.use("/contractor", contractorRouter);
app.use("/worker", workerRouter);
app.use("/admin", adminRouter);
app.use("/user", userRouter);

app.listen(3000);
