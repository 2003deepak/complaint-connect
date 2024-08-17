const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const router = express.Router();
const workerModel = require('../../models/worker');
const userModel = require('../../models/user');
const complaintModel = require('../../models/complaint');
const sendOTP = require("../../utils/sendOTP");

const takeAction = async (req, res) => {
    let { id } = req.params;

    try {
        let complaint = await complaintModel.findOne({ _id: id }).populate("user");
        if (!complaint) {
            return res.status(404).send('Complaint not found');
        }

        let otp = Math.floor(1000 + Math.random() * 9000);

        let msg = `
        <html>
            <head>
                <title>OTP For Initial Verification</title>
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
                        <h1>Initial Visit Verification</h1>
                    </div>
                    <div class="content">
                        <p>Dear ${complaint.user.username},</p>
                        <p>Your complaint has been scheduled for an initial visit. To verify the visit, please use the OTP provided below:</p>
                        <p><strong>OTP: ${otp}</strong></p>
                        <p><strong>This OTP is valid for 5 Minutes only.</strong></p>
                        <p>Please provide this OTP to the worker only if the initial visit has been completed.</p>
                        <br>
                        <p>Best regards,</p>
                        <p>Your Company Name</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                    </div>
                </div>
            </body>
        </html>`;

        await sendOTP(complaint.user.email, "Initial Visit Verification", msg);

        res.cookie("initialVisitOTP", otp, { maxAge: 300000, httpOnly: true });

        await res.render("workerView/initialVisit", { id , email : complaint.user.email });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = takeAction;
