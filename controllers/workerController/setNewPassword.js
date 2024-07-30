const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const router = express.Router();
const workerModel = require("../../models/worker")


const setNewPassword  = async(req, res)=> {

    let {otp,newPassword} = req.body ; 

    if(otp == req.cookies['otp']){
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newPassword, salt, async (err, hash)=> {
    
                let worker = await workerModel.findOneAndUpdate({email : req.user.email}, {password : hash}, {new : true});
                res.clearCookie('otp');
                await res.redirect("/worker/updatePassword");

            });
        });
    }else{
        await res.render("workerView/updateCurrentPassword" , {otpsent : true , new_password : req.params.password , current_password : current_password });

    }


}   

module.exports = setNewPassword;