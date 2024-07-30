const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const router = express.Router();
const userModel = require('../../models/user');


const setNewPassword  = async(req, res)=> {

    let {otp,newPassword} = req.body ; 

    if(otp == req.cookies['otp']){
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newPassword, salt, async (err, hash)=> {
    
                let user = await userModel.findOneAndUpdate({email : req.user.email}, {password : hash}, {new : true});
                res.clearCookie('otp');
                await res.redirect("/user/updatePassword");

            });
        });
    }else{
        await res.render("userView/updateCurrentPassword" , {otpsent : true , new_password : req.params.password , current_password : current_password });

    }


}   

module.exports = setNewPassword;