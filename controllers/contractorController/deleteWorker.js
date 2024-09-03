const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const workerModel = require('../../models/worker');
const complaintModel = require('../../models/complaint');
const workerActionModel = require('../../models/workerAction');
const sendOTP = require("../../utils/sendOTP");
const deleteFileFromIKit = require("../../utils/deleteFileFromIKit");

const deleteWorker = async (req, res) => {
    let { id } = req.params;

    try {
        // Find and delete the worker
        let workerExist = await workerModel.findOneAndDelete({ _id: id });

        if (!workerExist) {
            req.flash("error", "Worker not found");
            return res.redirect("/contractor/manageWorker");
        }

        // Delete all worker actions associated with this worker
       await workerActionModel.deleteMany({ workerAssigned: id });

        // Update the workerAssigned property of complaints where the worker was assigned
        await complaintModel.updateMany({ assignedWorker: id }, { assignedWorker: null });

        // Delete the worker's Aadhar card file from ImageKit
        if (workerExist.aadhar_card && workerExist.aadhar_card[1]) {
            try {
                deleteFileFromIKit(workerExist.aadhar_card[1]);
            } catch (fileDeleteError) {
                console.error('Failed to delete file from ImageKit:', fileDeleteError);
                req.flash("error", "Worker deleted, but failed to delete associated file.");
                return res.redirect("/contractor/manageWorker");
            }
        }

        // Send account deletion notification
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

        req.flash("success", "Worker Deleted!");
        return res.redirect("/contractor/manageWorker");

    } catch (err) {
        console.error('Error deleting worker:', err);
        req.flash("error", "Something went wrong. Please try again later.");
        return res.status(500).send("An error occurred");
    }
};

module.exports = deleteWorker;
