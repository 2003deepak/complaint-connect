const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const userModel = require('../../models/user');
const sendOTP = require("../../utils/sendOTP");

const deleteUser = async (req, res) => {

    let { id } = req.params;

    try {
        let userExist = await userModel.findOneAndDelete({ _id: id });
       
        if (userExist) {
            fs.unlink("public/userUpload/allotment_letter/" + userExist.allotmentLetter, (err) => {
                if (err) {
                    console.log("Error deleting Allotment Letter");
                }
            });

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
            await res.redirect("/admin/editUser");

        } else {
            console.log("User not found");
            await res.redirect("/admin/dashboard");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred");
    }

   
};

module.exports = deleteUser;
