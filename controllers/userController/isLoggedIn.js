const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const generateToken = require('../../utils/generateToken');
const router = express.Router();
const userModel = require('../../models/user');
const workerModel = require('../../models/worker');


const isLoggedIn = async (req, res, next) => {

    if(!req.cookies.token){
        res.redirect("/login");
    }else{
        const data = jwt.verify(req.cookies.token , process.env.JWT_KEY);
        if(data.role == "user"){
            let userData = await userModel.findOne({username : data.username})
            req.user = userData;
        }else{
            let workerData = await workerModel.findOne({username : data.username})
            req.user = workerData;
        }
        
        next();
    }



}


module.exports = isLoggedIn;