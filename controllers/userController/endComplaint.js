const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const userModel = require('../../models/user');
const complaintModel = require('../../models/complaint');
const closedComplaintModel = require('../../models/closedComplaint');
const priorityComplaintModel = require('../../models/priorityComplaint');
const workerActionModel = require('../../models/workerAction');
const imagekit = require('../../config/imageKit');
const cutAndPasteFile = require('../../utils/cutAndPasteFile');

const endComplaint = async (req, res) => {
    const complaintID = req.params.id;
    const rating = req.body.rating;

    try {
        // Fetch complaint details
        const complaint = await complaintModel.findOne({ _id: complaintID });
        if (!complaint) {
            return res.status(404).send('Complaint not found');
        }

        // Move images in parallel
        const [newComplaintImg, newResolvedImg] = await Promise.all([
            cutAndPasteFile(complaint.complaintImage[1], "/closedComplaint"),
            cutAndPasteFile(complaint.resolvedImage[1], "/closedComplaint")
        ]);

        // Create closed complaint entry
        const closedComplaint = await closedComplaintModel.create({
            user: complaint.user,
            complaintId: complaint.complaintId,
            complaintType: complaint.complaintType,
            subject: complaint.subject,
            description: complaint.description,
            complaintImage: [newComplaintImg.url, newComplaintImg.fileId],
            resolvedImage: [newResolvedImg.url, newResolvedImg.fileId],
            createdAt: complaint.createdAt,
            resolvedAt: complaint.resolvedAt,
            assignedWorker: complaint.assignedWorker,
            rating: rating
        });

        // Perform database operations in parallel
        await Promise.all([
            workerActionModel.findOneAndDelete({ complaintId: complaintID }),
            complaintModel.deleteOne({ _id: complaintID }),
            priorityComplaintModel.deleteMany({ complaintId: complaintID })
        ]);

        req.flash("success", "Complaint Closed Successfully!");
        res.redirect("/user/dashboard");
    } catch (error) {
        console.error("Error closing complaint:", error);
        req.flash("error", "Something Went Wrong!");
        res.redirect("/user/dashboard");
    }
};

module.exports = endComplaint;
