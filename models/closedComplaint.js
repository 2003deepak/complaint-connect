const mongoose = require('mongoose');

const closedComplaintSchema = mongoose.Schema({

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        complaintId: String,
        complaintType: String,
        subject: String,
        description: String,
        complaintImage: String,
        resolvedImage: String,
        createdAt: Date,
        resolvedAt: Date,
        approvedByUserAt: {
            type: Date,
            default : Date.now
        },
        assignedWorker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'worker',
        },
        rating : Number
});

module.exports = mongoose.model("closedComplaint", closedComplaintSchema);
