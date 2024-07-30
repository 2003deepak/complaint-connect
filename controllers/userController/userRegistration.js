const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const router = express.Router();
const userModel = require('../../models/user');


const registerUser  = async(req, res)=> {

    let {username,email,password,buildingNumber,roomNumber} = req.body;

    try{

        let userExist = await userModel.findOne({email : email});
        if(userExist){
            console.log("User already exists")
        }else{

            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, async (err, hash)=> {
        
                    let user = await userModel.create({
                         
                        username: username,
                        password: hash,
                        email: email,
                        buildingNumber: buildingNumber, 
                        roomNumber: roomNumber, 
                        allotmentLetter: req.file.filename,
                       
                    })
                
                    
                    await res.redirect("/login");
                });
            });
    
    
    
    



        }

        
    }catch(err){
        console.log(err);
    }
    


    
}

module.exports = registerUser;