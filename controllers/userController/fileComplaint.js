const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const generateComplaintId = require('../../utils/generateComplaintId');
const router = express.Router();
const complaintModel = require('../../models/complaint');
const userModel = require('../../models/user');
const user = require('../../models/user');
const drive = require('../../config/gApi'); 
const fs = require('fs')

const fileComplaint  = async(req, res)=> {


    let { complaint_group,subject,desc} = req.body;

    let complaintId = generateComplaintId();

    // Check if the complaintID exists

    let complaintExist = await complaintModel.findOne({complaintId : complaintId});

    if(complaintExist){
        console.log("Complaint already exists")
        return res.redirect('/user/complaint')

    }

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


            let complaint = await complaintModel.create({

                user : req.user._id ,
                complaintId: generateComplaintId(),
                complaintType: complaint_group,
                subject: subject,
                description: desc,
                complaintImage: publicUrl,

            })
            
            // Clean up the temporary file
            await fs.unlinkSync(path.join(__dirname, '../../public/userUpload', file.filename));
            
            await res.redirect('/user/dashboard')



    }catch(error){
        console.log("GDrive Error: " + error);
    }

}

module.exports = fileComplaint;