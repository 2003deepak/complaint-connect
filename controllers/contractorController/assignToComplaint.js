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
    try {
        let workerId = req.body.worker_assigned;
        let complaintID = req.params.id;

        // Find the complaint and update it with the assigned worker
        let complaint = await complaintModel.findOne({ _id: complaintID }).populate("user");
        if(complaint.assignedWorker){

            // delete previus worker assigned to complaint 
            let deletedWorker = await workerActionModel.findOneAndDelete({complaintId: complaintID})

        }
        complaint.assignedWorker = workerId;
        complaint.updatedAt = Date.now();
        await complaint.save();

        // Find the worker by ID
        let worker = await workerModel.findOne({ _id: workerId });

        // Add worker action to the database
        let addWorker = await workerActionModel.create({
            complaintId: complaintID,
            workerAssigned: workerId,
        });

        // Generate OTP (assuming this is how you generate the OTP)
        let otp = Math.floor(100000 + Math.random() * 900000); // Example OTP generation

        // Compose the email message with styling
        let msg = `
            <html>
                <head>
                    <title>Worker Assigned</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                        }
                        .container {
                            margin: 0 auto;
                            padding: 20px;
                            max-width: 600px;
                            border: 1px solid #ddd;
                            border-radius: 10px;
                        }
                        .header {
                            background-color: #FF9F00;
                            padding: 10px;
                            text-align: center;
                            border-bottom: 1px solid #ddd;
                        }
                        .content {
                            padding: 20px;
                        }
                        .footer {
                            margin-top: 20px;
                            text-align: center;
                            color: #888;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Worker Assigned</h1>
                        </div>
                        <div class="content">
                            <p>Dear ${complaint.user.username},</p>
                            <p>We trust this message finds you in good health. We wish to notify you that your complaint, identified as <b>${complaint.complaintId}</b> on our Complaint Connect platform, has been assigned to a designated worker, <b>${worker.username}</b>. This individual will be visiting your location to resolve the issue.</p>
                            <p>The visit is scheduled to take place within the next 1-3 days. Please ensure that someone is present at the premises during this period to facilitate the visit.</p>
                            <p>For your safety and security, we are providing you with the worker's Aadhar card details. You can verify the worker's identity by accessing their Aadhar card details here:</p>
                            <a href=${`${worker.aadhar_card[0]}`} target='_blank'>View Aadhar Card</a>
                            <p>It is imperative to verify the worker's identity using the provided Aadhar card details before allowing them access to your premises.</p>

                            <br>
                            <p>Best regards,</p>
                            <p>Your Company Name</p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                        </div>
                    </div>
                </body>
            </html>
        `;

        // Send the email to the user
        sendOTP(complaint.user.email, "Worker Assigned", msg);

        // Flash success message and redirect
        req.flash("success", "Worker successfully assigned to the complaint.");
        await res.redirect("/contractor/pendingComplaint");

    } catch (error) {
        
        req.flash("error", "An error occurred while assigning the worker. Please try again later.");
        await res.redirect("/contractor/pendingComplaint");
    }
};

module.exports = assignToComplaint;
