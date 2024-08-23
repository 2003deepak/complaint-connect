const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const {generateToken , generateTokenForOther} = require('../../utils/generateToken');

const router = express.Router();
const userModel = require('../../models/user');

const loginAuth = async (req, res) => {
    let { username, password, rememberme } = req.body;

    // Admin Login
    if(username == "admin" && password == "admin") {

        let token = generateTokenForOther("admin");
        res.cookie('token', token);

        return res.redirect("/admin/dashboard")
    }

    // Contractor Login
    if(username == "contractor" && password == "contractor") {

        let token = generateTokenForOther("contractor");
        res.cookie('token', token);


        return res.redirect("/contractor/dashboard")
    }

    let user = await userModel.findOne({ username: username });

    if (!user) {
        req.flash("error","Invalid Username or Password");
        return res.redirect("/login");
    }

    let match = await bcrypt.compare(password, user.password);

    if (match) {

        if(user.isAllowed){


            let token = generateToken(user, "user");
            res.cookie('token', token);
    
            if (rememberme == "on") {
                res.cookie('credentials', {username : username , password:password}, { maxAge: 20000, httpOnly: true });
            }
    
            return res.redirect("/user/dashboard");




        }else{
            req.flash("error","Invalid Username or Password");
            return res.redirect("/login");
        }
       
    } else {
        req.flash("error","Invalid Username or Password");
        return res.redirect("/login");
    }
}

module.exports = loginAuth;
