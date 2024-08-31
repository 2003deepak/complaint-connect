const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const userModel = require('../../models/user');
const complaintModel = require('../../models/complaint');
const closedComplaintModel = require('../../models/closedComplaint');
const workerActionModel = require('../../models/workerAction');
const imagekit = require('../../config/imageKit');
const cutAndPasteFile = require('../../utils/cutAndPasteFile');


const endComplaint = async (req, res) => {
    try {
        let complaintID = req.params.id;
        let rating = req.body.rating;

        let complaint = await complaintModel.findOne({ _id: complaintID });

        // moving complaint img to closed complaint 
        let newComplaintImg = await cutAndPasteFile(complaint.complaintImage[1] , "/closedComplaint")

       

        // moving resolved img to closed complaint
        let newResolvedImg = await cutAndPasteFile(complaint.resolvedImage[1] , "/closedComplaint")


        if (!complaint) {
            return res.status(404).send('Complaint not found');
        }
        
            // Create a closed complaint entry
            let closedComplaint = await closedComplaintModel.create({
                user: complaint.user,
                complaintId: complaint.complaintId,
                complaintType: complaint.complaintType,
                subject: complaint.subject,
                description: complaint.description,
                complaintImage: [newComplaintImg.url , newComplaintImg.fileId],
                resolvedImage: [newResolvedImg.url , newResolvedImg.fileId],
                createdAt: complaint.createdAt,
                resolvedAt: complaint.resolvedAt,
                assignedWorker: complaint.assignedWorker,
                rating: rating
            });

            let worker_action = await workerActionModel.findOneAndDelete({complaintId : complaintID })

            // Delete the original complaint
            await complaintModel.deleteOne({ _id: complaintID });

            await res.redirect("/user/dashboard")
        }catch (error) {
        console.error('Error handling complaint:', error);
        res.status(500).send('Internal server error');
    }
};

module.exports = endComplaint;
