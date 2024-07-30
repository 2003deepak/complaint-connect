const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const {generateToken , generateTokenForOther} = require('../../utils/generateToken');
const swal = require('sweetalert');

const router = express.Router();
const workerModel = require('../../models/worker');

const loginAuth = async (req, res) => {
    let { username, password, rememberme } = req.body;

    

    let worker = await workerModel.findOne({ username: username });

    if (!worker) {
        return res.render("userView/login");
    }

    let match = await bcrypt.compare(password, worker.password);

    if (match) {

        
            let token = generateToken(worker, "worker");
            res.cookie('token', token);
    
            if (rememberme == "on") {
                res.cookie('credentials', {username : username , password:password}, { maxAge: 20000, httpOnly: true });
            }
    
            return res.redirect("/worker/dashboard");



       
    } else {
        return res.send("Invalid username or password");
    }
}

module.exports = loginAuth;
