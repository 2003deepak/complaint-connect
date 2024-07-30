const mongoose = require('mongoose');

const workerActionSchema = mongoose.Schema({

        complaintId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'complaint'
        },
        workerAssigned : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'worker'
        },
        actionTaken:{
            type : Boolean,
            default : false 
        },
        completed:{
            type : Boolean,
            default : false
        }
       
});

module.exports = mongoose.model("workerAction", workerActionSchema);
