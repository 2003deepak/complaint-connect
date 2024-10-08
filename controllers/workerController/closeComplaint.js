const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const workerModel = require('../../models/worker');
const userModel = require('../../models/user');
const workerActionModel = require('../../models/workerAction');
const complaintModel = require('../../models/complaint');
const sendOTP = require("../../utils/sendOTP");
let generateOTP = require('../../utils/generateOTP');
const worker = require('../../models/worker');
const deleteFileFromIKit = require('../../utils/deleteFileFromIKit');
const imagekit = require('../../config/imageKit');

const closeComplaint = async (req, res) => {
    try {
        let worker_action = await workerActionModel.findOne({ complaintId: req.params.id }).populate([
            { path: 'workerAssigned' },
            { path: 'complaintId' }
        ]);

        if (!worker_action) {
            req.flash("error", "Worker action not found!");
            return res.redirect('/worker/pendingComplaint');
        }

        if (worker_action.complaintId.resolvedImage) {
            const currentComplaintImage = worker_action.complaintId.resolvedImage[1];
            try {
                await deleteFileFromIKit(currentComplaintImage);
            } catch (error) {
                req.flash("error", "Failed to delete the existing resolved image.");
                return res.redirect('/worker/pendingComplaint');
            }
        }

        const file = req.file;

        // Upload file to ImageKit
        let result;
        try {
            result = await imagekit.upload({
                file: file.buffer,
                fileName: file.originalname,
                folder: "/resolvedComplaint",
            });
        } catch (error) {
            req.flash("error", "File upload failed.");
            return res.redirect('/worker/pendingComplaint');
        }

        worker_action.completed = true;
        await worker_action.save();

        let complaint = await complaintModel.findOneAndUpdate(
            { _id: req.params.id },
            { resolvedAt: Date.now(), resolvedImage: [result.url, result.fileId] }
        ).populate("user");

        if (!complaint) {
            req.flash("error", "Complaint not found!");
            return res.redirect('/worker/pendingComplaint');
        }

        let msg = `
            <html>
                <head>
                    <title>Complaint Resolved</title>
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
                            <h1>Complaint Resolved</h1>
                        </div>
                        <div class="content">
                            <p>Dear ${complaint.user.username},</p>
                            <p>We are pleased to inform you that your complaint has been resolved by our team.</p>
                            <p>You can view the full details of your complaint and the before and after images using the following links:</p>
                            <br>

                            <p>If you are satisfied with the resolution, please close the complaint on our platform.</p>
                            <p><br>If you are not satisfied, you can relodge the complaint, and it will be processed with higher priority.</br></p>
                            <p><br>If no action is taken on the complaint within 7 days, it will be automatically closed.</br></p>

                            <p>Best regards,</p>
                            <p>Your Company Name</p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                        </div>
                    </div>
                </body>
            </html>`;

        try {
            await sendOTP(complaint.user.email, "Complaint Resolved", msg);
        } catch (error) {
            req.flash("error", "Failed to send the notification email.");
            return res.redirect('/worker/pendingComplaint');
        }

        req.flash("success", "Complaint Closed!");
        res.redirect('/worker/dashboard');
    } catch (error) {
        req.flash("error", "An unexpected error occurred.");
        res.redirect('/worker/pendingComplaint');
    }
};

module.exports = closeComplaint;
