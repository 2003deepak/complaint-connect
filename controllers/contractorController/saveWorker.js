const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const router = express.Router();
const workerModel = require('../../models/worker');
const sendOTP = require("../../utils/sendOTP")
const imagekit = require('../../config/imageKit');


const saveWorker  = async(req, res)=> {

    let {username,email,password,workArea} = req.body;

    try{

        const file = req.file;
            
        // Upload file to ImageKit
        const result = await imagekit.upload({
            file: file.buffer,
            fileName: file.originalname,
            folder: "/workerAadhar",
            });

        let workerExist = await workerModel.findOne({email : email});
        if(workerExist){
            req.flash("error", "Worker already exists");
            await res.redirect("/contractor/addWorker");
            
        }else{

            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, async (err, hash)=> {
        
                    let worker = await workerModel.create({
                         
                        username: username,
                        password: hash,
                        email: email,
                        aadhar_card : [result.url,result.fileId],
                        work_area : workArea,
                       
                    })

                    let message = `
                                <html>
                                    <head>
                                        <title>Welcome to Our Portal</title>
                                    </head>
                                    <body>
                                        <p>We hope this message finds you well. We are delighted to inform you that your registration as a worker has been successfully processed. You are now officially a part of our team!</p>
                                        <p>Here are your login details:</p>
                                        <ul>
                                            <li><strong>Username:</strong> ${username}</li>
                                            <li><strong>Password:</strong> ${password}</li>
                                        </ul>
                                        <p>Please log in to our portal using the provided credentials. Upon your first login, we highly recommend updating your password for security purposes. You can do this by navigating to your account settings and following the password update instructions.</p>
                                        <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
                                        <p>Thank you for joining us, and we look forward to working together!</p>
                                        <br>
                                    </body>
                                </html>`;


                    sendOTP(email,"Account Created" , message)

                    req.flash("success", "Worker Added Successfully!");
                    await res.redirect('/contractor/addWorker');

               
                });
            });
    
    
    
    



        }

        
    }catch(err){
        req.flash("error", "Something went wrong");
        await res.redirect("/contractor/addWorker");
    }
    


    
}

module.exports = saveWorker;