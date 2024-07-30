const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const generateComplaintId = require('../../utils/generateComplaintId');
const router = express.Router();
const complaintModel = require('../../models/complaint');
const sendOTP = require('../../utils/sendOTP');
const generateOTP = require('../../utils/generateOTP');


const checkPassword  = async(req, res)=> {

    let {current_password , new_password} = req.body ; 

    let match = await bcrypt.compare(current_password, req.user.password);

    

    if(match){
    
        let otp = generateOTP()
        if(sendOTP(req.user.email,"Password Updation" , `Hi You have request for updation of password OTP is ${otp} and it is valid for 5 minutes only`)){

            res.cookie('otp', otp, { maxAge: 60000 * 5, httpOnly: true });
            return res.render("userView/updateCurrentPassword" , {new_password , current_password ,otpSent : true , user : req.user});    
        }else{
            return res.redirect("/user/updatePassword");  
        }
    
    }else{
        return res.redirect("/user/updatePassword"); 
    }


    
}   

module.exports = checkPassword;