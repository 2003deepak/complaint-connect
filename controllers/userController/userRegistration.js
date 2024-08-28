const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const path = require('path');
const router = express.Router();
const userModel = require('../../models/user');
const drive = require('../../config/gApi');


const registerUser  = async(req, res)=> {

    let {username,email,password,buildingNumber,roomNumber} = req.body;

    try{

        
        const file = req.file;
    
        // Congiruation of gdrive 

        const response = await drive.files.create({
            requestBody: {
                name: file.originalname,
                mimeType: file.mimetype,
            },
                media: {
                mimeType: file.mimetype,
                body: fs.createReadStream(path.join(__dirname, '../../public/userUpload', file.filename)),
            },
        });
    
            // Make the file public
            await drive.permissions.create({
                fileId: response.data.id,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });
    
            // Get the public URL
            const publicUrl = `https://drive.google.com/uc?id=${response.data.id}`;
    
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
                            allotmentLetter: publicUrl,
                        
                        })

                        
                        // Clean up the temporary file
                        await fs.unlinkSync(path.join(__dirname, '../../public/userUpload', file.filename));
                    
                        
                        await res.redirect("/login");
                    });
                });
            }


    }catch(err){
        console.log(err);
    }

   
    


    
}

module.exports = registerUser;