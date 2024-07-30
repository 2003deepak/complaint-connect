const mongoose = require('mongoose');

const priorityComplaintSchema = mongoose.Schema({

    complaintId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'complaint'                           
    },
    description : String
    
});

module.exports = mongoose.model("priorityComplaint", priorityComplaintSchema);
