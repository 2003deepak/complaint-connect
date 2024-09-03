const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const router = express.Router();
const workerModel = require('../../models/worker');
const userModel = require('../../models/user');
const sendOTP = require("../../utils/sendOTP");

const acceptUser = async (req, res) => {
    let { id } = req.params;

    try {
        let user = await userModel.findOneAndUpdate({ _id: id }, { isAllowed: true });

        if (user) {
            let message = `
                <html>
                    <head>
                        <title>Permission Granted</title>
                    </head>
                    <body>
                        <p>We are pleased to inform you that your request for access has been granted. You now have the necessary permissions to access our portal.</p>
                        <p>Please log in to our portal using your existing credentials. If you encounter any issues or need assistance, feel free to reach out to our support team.</p>
                        <p>Thank you for your patience, and we look forward to your active participation.</p>
                        <br>
                        <p>Best regards,</p>
                        <p>Your Company Name</p>
                    </body>
                </html>`;

            sendOTP(user.email, "Permission Granted", message);

            req.flash("success", "User Accepted!");
            await res.redirect('/admin/editUser');
        } else {
            req.flash("error", "Pls Try Again Later");
            await res.redirect('/admin/dashboard');
        }
    } catch (err) {
        
        req.flash("error", "Pls Try Again Later");
        res.status(500).send("An error occurred");
    }
};

module.exports = acceptUser;
