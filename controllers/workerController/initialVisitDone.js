const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const router = express.Router();
const workerModel = require('../../models/worker');
const userModel = require('../../models/user');
const workerActionModel = require('../../models/workerAction');
const complaintModel = require('../../models/complaint');
const sendOTP = require("../../utils/sendOTP");
let generateOTP = require('../../utils/generateOTP');
const worker = require('../../models/worker');

const initialVisitDone = async (req, res) => {
   
    let {finalOTP} = req.body 
    let complaintId = req.params.id
   
    if(finalOTP == (req.cookies["initialVisitOTP"])){

        
        let worker_action = await workerActionModel.findOneAndUpdate({complaintId : complaintId},{actionTaken : true})
        let complaint = await complaintModel.findOneAndUpdate({complaintId : complaintId},{updatedAt : Date.now()})
        res.clearCookie('initialVisitOTP');
        res.redirect('/worker/dashboard')

    }else{
        res.send("Failed OTP")
    }

}

module.exports = initialVisitDone;
