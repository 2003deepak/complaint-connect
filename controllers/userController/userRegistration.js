const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const path = require('path');
const router = express.Router();
const userModel = require('../../models/user');
const imagekit = require('../../config/imageKit');


const registerUser  = async(req, res)=> {

    let {username,email,password,buildingNumber,roomNumber} = req.body;

    try{

        
            const file = req.file;
            
            // Upload file to ImageKit
            const result = await imagekit.upload({
            file: file.buffer,
            fileName: file.originalname,
            folder: "/allotmentLetter",
            });
        
    
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
                            allotmentLetter: [result.url,result.fileId],
                        
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