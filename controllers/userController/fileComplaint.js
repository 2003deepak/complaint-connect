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
const fs = require('fs')
const imagekit = require('../../config/imageKit');

const fileComplaint  = async(req, res)=> {


    let { complaint_group,subject,desc} = req.body;

    let complaintId = generateComplaintId();

    // Check if the complaintID exists

    let complaintExist = await complaintModel.findOne({complaintId : complaintId});

    if(complaintExist){
        console.log("Complaint already exists")
        req.flash("error","Complaint already exists");
        return res.redirect('/user/complaint')

    }

    const file = req.file;

    // Upload file to ImageKit
    const result = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: "/complaintImage",
        });


        try{

            let complaint = await complaintModel.create({

                user : req.user._id ,
                complaintId: generateComplaintId(),
                complaintType: complaint_group,
                subject: subject,
                description: desc,
                complaintImage: [result.url , result.fileId],
        
            })

            req.flash("success","Complaint filed successfully!");
            await res.redirect('/user/complaint')



        }catch(error){

            req.flash("error","Complaint filed failed!");
            return res.redirect('/user/complaint')

        }


}

module.exports = fileComplaint;