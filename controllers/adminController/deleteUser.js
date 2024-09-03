const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const userModel = require('../../models/user');
const sendOTP = require("../../utils/sendOTP");
const deleteFileFromIKit = require('../../utils/deleteFileFromIKit');

const deleteUser = async (req, res) => {
    let { id } = req.params;

    try {
        // Find the user by ID
        let userExist = await userModel.findOne({ _id: id });

        if (!userExist) {
            req.flash("error", "User not found!");
            return res.redirect("/admin/editUser");
        }

        // Delete the file from ImageKit
        if (userExist.allotmentLetter && userExist.allotmentLetter[1]) {
            try {
                deleteFileFromIKit(userExist.allotmentLetter[1]);

            } catch (fileDeleteError) {
                
                req.flash("error", "Failed to delete associated file. Please try again later.");
                return res.redirect("/admin/editUser");
            }
        } else {
            console.warn('No file ID found for deletion.');
        }

        // Delete the user from the database
        let userDeleted = await userModel.findOneAndDelete({ _id: id });



        // Send the account deletion notification email
        let message = `
            <html>
                <head>
                    <title>Account Deletion Notification</title>
                </head>
                <body>
                    <p>We regret to inform you that your registration as a worker has been terminated and your account has been deleted from our system by the admin.</p>
                    <p>If you have any questions or require further assistance, please do not hesitate to reach out to our support team.</p>
                    <p>Thank you for your understanding.</p>
                    <br>
                    <p>Best regards,</p>
                    <p>Your Company Name</p>
                </body>
            </html>`;
        
        sendOTP(userExist.email, "Account Deleted", message);

        req.flash("success", "User Deleted!");
        await res.redirect("/admin/editUser");

    } catch (error) {
        console.error('Error deleting user:', error);
        req.flash("error", "Please try again later.");
        await res.redirect("/admin/editUser");
    }
};

module.exports = deleteUser;
