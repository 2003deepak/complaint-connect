const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const workerModel = require('../../models/worker');
const sendOTP = require("../../utils/sendOTP");

const deleteWorker = async (req, res) => {
    let { id } = req.params;

    try {
        let workerExist = await workerModel.findOneAndDelete({ _id: id });

        fs.unlink("public/userUpload/aadhar_card/" + workerExist.aadhar_card,(err)=>{
            if(err) console.error("Error Deleting");
            else console.log("Done Deleting");
        }) 


        if (workerExist) {
            let message = `
                <html>
                    <head>
                        <title>Account Deletion Notification</title>
                    </head>
                    <body>
                        <p>We regret to inform you that your registration as a worker has been terminated and your account has been deleted from our system.</p>
                        <p>If you have any questions or require further assistance, please do not hesitate to reach out to our support team.</p>
                        <p>Thank you for your understanding.</p>
                        <br>
                        <p>Best regards,</p>
                        <p>Your Company Name</p>
                    </body>
                </html>`;

            sendOTP(workerExist.email, "Account Deleted", message);

            await res.redirect("/contractor/manageWorker");
        } else {
            console.log("Worker not found");
            await res.redirect("/contractor/manageWorker");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred");
    }
};

module.exports = deleteWorker;
