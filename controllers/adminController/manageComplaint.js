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
const imagekit = require('../../config/imageKit');



const acceptComplaint = async (req, res) => {

    let {id} = req.params

    let complaint = await complaintModel.findOneAndUpdate({_id : id },{isApproved: true})

    if(complaint){

        req.flash("success", "Complaint Approved!");
        await res.redirect("/admin/approveComplaint")

    }else{
        req.flash("error", "Something went wrong");
        await res.redirect("/admin/approveComplaint")
    }

    

    

    
   
};

const rejectComplaint = async (req, res) => {

    let {id} = req.params

    
    let complaints = await complaintModel.findOne({_id : id}).populate("user")
    let deletedComplaint =  imagekit.deleteFile(complaints.complaintImage[1]);

    

    let complaint = await complaintModel.findOneAndDelete({_id : id})
    
    if(complaint){

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


            req.flash("success", "Complaint Deleted!");
            await res.redirect("/admin/approveComplaint")




    }else{
        req.flash("error", "Something went wrong");
        await res.redirect("/admin/approveComplaint")
    }

    
};

module.exports = {acceptComplaint, rejectComplaint};
