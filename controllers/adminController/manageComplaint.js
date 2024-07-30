const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const userModel = require('../../models/user');
const complaintModel = require('../../models/complaint');
const sendOTP = require("../../utils/sendOTP");



const acceptComplaint = async (req, res) => {

    let {id} = req.params

    let complaint = await complaintModel.findOneAndUpdate({_id : id },{isApproved: true})

    await res.redirect("/admin/approveComplaint")

    

    
   
};

const rejectComplaint = async (req, res) => {

    let {id} = req.params

    
    let complaints = await complaintModel.findOne({_id : id}).populate("user")
    

    let complaint = await complaintModel.findOneAndDelete({_id : id})
    

   

    fs.unlink("public/userUpload/complaint_image/" + complaints.complaintImage, (err) => {
        if (err) {
            console.log("Error deleting Complaint Image");
        }
    });

    let message = `
    <html>
        <head>
            <title>Complaint Rejected</title>
        </head>
        <body>
            <p>We regret to inform you that your complaint has been rejected after careful consideration. Unfortunately, it does not meet our criteria for action at this time.</p>
            <p>If you have any further questions or need more details about this decision, please feel free to contact our support team.</p>
            <p>Thank you for your understanding and patience.</p>
            <br>
            <p>Best regards,</p>
            <p>Your Company Name</p>
        </body>
    </html>`;

    sendOTP(complaints.user.email, "Complaint Rejected", message);

    await res.redirect("/admin/approveComplaint")
};

module.exports = {acceptComplaint, rejectComplaint};
