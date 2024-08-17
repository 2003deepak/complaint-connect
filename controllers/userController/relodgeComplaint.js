const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const complaintModel = require('../../models/complaint');
const priorityComplaintModel = require('../../models/priorityComplaint');
const workerActionModel = require('../../models/workerAction');
const { devNull } = require('os');


const relodgeComplaint = async (req, res) => {
    
    const cause = req.body.cause;                        
    const complaintID = req.params.id;  
    

    const priority = await priorityComplaintModel.create({
        complaintId: complaintID,
        description : cause
    })

    const complaint = await complaintModel.findOneAndUpdate({_id : complaintID}, { isPriority : true, resolvedAt: null } );
    const worker_action = await workerActionModel.findOneAndUpdate({complaintId : complaintID}, {completed : false})
    await res.redirect("/user/dashboard")
}

module.exports = relodgeComplaint;
