const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const router = express.Router();
const workerModel = require('../../models/worker');
const complaintModel = require('../../models/complaint');
const workerActionModel = require('../../models/workerAction');
const sendOTP = require("../../utils/sendOTP");





const assignToComplaint = async (req, res) => {

    
    let workerId = req.body.worker_assigned;
    let complaintID = req.params.id;

    let complaint = await complaintModel.findOne({ _id: complaintID }).populate("user");
    complaint.assignedWorker = workerId;
    complaint.updatedAt = Date.now();
    await complaint.save();

    // To get the worker username and aadhar_card 
    let worker = await workerModel.findOne({ _id: workerId });
    
    let addWorker = await workerActionModel.create({
        complaintId: complaintID,
        workerAssigned: workerId,
        
    })

 
    let msg = `
        <html>
        <body>
            <p>Dear User,</p>
            <p>We trust this message finds you in good health. We wish to notify you that your complaint, identified as <b>${complaint.complaintId}</b> on our Complaint Connect platform, has been assigned to a designated worker, <b>${worker.username}</b>. This individual will be visiting your location to resolve the issue.</p>
            <p>The visit is scheduled to take place within the next 1-3 days. Please ensure that someone is present at the premises during this period to facilitate the visit.</p>
            <p>For your safety and security, we are providing you with the worker's Aadhar card details. You can verify the worker's identity by accessing their Aadhar card details here:</p>
            <a href=${`/public/userUpload/aadhar_card/${worker.aadhar_card}`} target='_blank'>View Aadhar Card</a>
            <p>It is imperative to verify the worker's identity using the provided Aadhar card details before allowing them access to your premises.</p>
            <p>Best regards,<br>[Your Name]<br>[Your Position]<br>[Your Contact Information]</p>
        </body>
        </html>
    `;
    sendOTP(complaint.user.email, "Worker Assigned", msg);

    await res.redirect("/contractor/pendingComplaint");
};

module.exports = assignToComplaint;
