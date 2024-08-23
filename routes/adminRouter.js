const express = require('express');
const complaintModel = require('../models/complaint');
const isLoggedIn = require('../controllers/userController/isLoggedIn');
const userModel = require('../models/user');
const closedComplaintModel = require('../models/closedComplaint');
const acceptUser = require('../controllers/adminController/acceptUser');
const deleteUser = require('../controllers/adminController/deleteUser');
const {acceptComplaint, rejectComplaint} = require('../controllers/adminController/manageComplaint');
const router = express.Router();


router.get("/dashboard" ,isLoggedIn,async(req, res) =>{

    let newComplaint = await complaintModel.find({
        resolvedAt: null,
        updatedAt: null,
        isApproved: true
    });

    let pendingComplaint = await complaintModel.find({
        resolvedAt: null,
        updatedAt: { $ne: null }, // Not equal to null
        isApproved: true
    });

    let completedComplaint = await complaintModel.find({
        resolvedAt: { $ne: null },
        updatedAt: { $ne: null }, // Not equal to null
        isApproved: true
    });



    res.render("adminView/adminDashboard" , {newComplaint,pendingComplaint,completedComplaint});
})

router.get("/editUser" ,isLoggedIn,async(req, res) =>{

    let users = await userModel.find();
   
    res.render("adminView/editUser" , {users});
})

router.get('/complaintData/:id', async (req, res)=> {
   
    let complaint = await complaintModel.findOne({ _id: req.params.id}).populate("assignedWorker");
    
    await res.render('complaintData', { complaint});
});

router.get('/closed/complaintData/:id', async (req, res)=> {
   
    let complaint = await closedComplaintModel.findOne({ _id: req.params.id}).populate("assignedWorker");

    await res.render('closedComplaint', { complaint });

});

router.get("/approveComplaint" ,isLoggedIn,async(req, res) =>{

    let complaints = await complaintModel.find({isApproved : false}).populate("user");
   
    await res.render("adminView/approveComplaint",{complaints});
    
})

router.get('/closedComplaint',isLoggedIn,async(req,res)=>{

    let complaints = await closedComplaintModel.find().populate([{ path: 'user' }, { path: 'assignedWorker' }]);


    res.render("adminView/closedComplaint" , {complaints});
    

})

router.get("/editUser/acceptUser/:id",isLoggedIn,acceptUser)
router.get("/editUser/deleteUser/:id",isLoggedIn,deleteUser)
router.get("/approveComplaint/acceptComplaint/:id",isLoggedIn,acceptComplaint)
router.get("/approveComplaint/rejectComplaint/:id",isLoggedIn,rejectComplaint)



module.exports = router ; 