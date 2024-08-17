const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const userModel = require('../../models/user');
const complaintModel = require('../../models/complaint');
const closedComplaintModel = require('../../models/closedComplaint');
const workerActionModel = require('../../models/workerAction');

const endComplaint = async (req, res) => {
    try {
        let complaintID = req.params.id;
        let rating = req.body.rating;


       

        let complaint = await complaintModel.findOne({ _id: complaintID });

        if (!complaint) {
            return res.status(404).send('Complaint not found');
        }

        // If user is not satisfied and the second time after complaint is resolved , the previous image uploaded by worker needs to be deleted

        

        const sourcePath = path.join(__dirname, "../../public/userUpload/complaint_image/" + complaint.complaintImage);
        const destinationPath = path.join(__dirname, "../../public/userUpload/closed_complaint/" +  complaint.complaintImage);

        // Moving Complaint Image to Closed_Complaint Directory 
        fs.rename(sourcePath, destinationPath, async (err) => {
            if (err) {
                console.error('Error moving file:', err);
                return res.status(500).send('Error moving file');
            }
        })

        const sourcePathForResolved = path.join(__dirname, "../../public/userUpload/resolved_complaint/" + complaint.resolvedImage);
        const destinationPathForResolved = path.join(__dirname, "../../public/userUpload/closed_complaint/" + complaint.resolvedImage);

        
        // Moving Resolved Image to Closed_Complaint Directory 
        fs.rename(sourcePathForResolved, destinationPathForResolved, async (err) => {
            if (err) {
                console.error('Error moving file:', err);
                return res.status(500).send('Error moving file');
            }
        })
        

            // Create a closed complaint entry
            let closedComplaint = await closedComplaintModel.create({
                user: complaint.user,
                complaintId: complaint.complaintId,
                complaintType: complaint.complaintType,
                subject: complaint.subject,
                description: complaint.description,
                complaintImage: complaint.complaintImage,
                resolvedImage: complaint.resolvedImage,
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
