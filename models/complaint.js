const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        complaintId: String,
        complaintType: String,
        subject: String,
        description: String,
        complaintImage: String,
        resolvedImage: {
            type: String,
            default: null
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        resolvedAt: {
            type: Date,
            default: null
        },
        updatedAt: {
            type: Date,
            default: null
        },
        assignedWorker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'worker',
            default: null
        },
        isApproved: {
            type: Boolean,
            default: false
        },
        isPriority: {
            type: Boolean,
            default: false
        }
});

module.exports = mongoose.model("complaint", complaintSchema);
