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

const fileComplaint  = async(req, res)=> {


    let { complaint_group,subject,desc} = req.body;

    let complaintId = generateComplaintId();

    // Check if the complaintID exists

    let complaintExist = await complaintModel.findOne({complaintId : complaintId});

    if(complaintExist){
        console.log("Complaint already exists")
        return res.redirect('/user/complaint')

    }

    let complaint = await complaintModel.create({

        user : req.user._id ,
        complaintId: generateComplaintId(),
        complaintType: complaint_group,
        subject: subject,
        description: desc,
        complaintImage: req.file.filename,

    })
    
    await res.redirect('/user/dashboard')


   

 
    
}

module.exports = fileComplaint;