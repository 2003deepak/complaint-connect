const express = require('express');
const complaintModel = require('../models/complaint');
const isLoggedIn = require('../controllers/userController/isLoggedIn');
const userModel = require('../models/user');
const closedComplaintModel = require('../models/closedComplaint');
const priorityComplaintModel = require('../models/priorityComplaint');
const acceptUser = require('../controllers/adminController/acceptUser');
const deleteUser = require('../controllers/adminController/deleteUser');
const {acceptComplaint, rejectComplaint} = require('../controllers/adminController/manageComplaint');
const router = express.Router();



router.use( async(req, res, next) => {

    // Count new users and unapproved complaints
    let newUserCount= await userModel.countDocuments({ isAllowed: false });
    let newComplaintCount = await complaintModel.countDocuments({ isApproved: false });


    // Set global variables
    res.locals.newUser = newUserCount;
    res.locals.newComplaintForDashboard= newComplaintCount;

    // Call the next middleware or route handler
    next();
});

router.get("/dashboard", isLoggedIn, async (req, res) => {
    try {
        // Fetch complaints with different statuses
        let newComplaint = await complaintModel.find({
            resolvedAt: null,
            updatedAt: null,
            isApproved: true
        });

        let pendingComplaint = await complaintModel.find({
            resolvedAt: null,
            updatedAt: { $ne: null },
            isApproved: true
        });

        let completedComplaint = await complaintModel.find({
            resolvedAt: { $ne: null },
            updatedAt: { $ne: null },
            isApproved: true
        });

    

        // Render the dashboard view with data
        res.render("adminView/adminDashboard", {
            newComplaint,
            pendingComplaint,
            completedComplaint,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


router.get("/editUser" ,isLoggedIn,async(req, res) =>{

    let users = await userModel.find();
    let error = req.flash("error");
    let success = req.flash("success");
   
    res.render("adminView/editUser" , {users , error , success});
})

router.get('/complaintData/:id', isLoggedIn , async (req, res)=> {
   
    let complaint = await complaintModel.findOne({ _id: req.params.id}).populate("assignedWorker");

    if(complaint.isPriority){

        let priority = await priorityComplaintModel.findOne({ complaintId:req.params.id})
        
        res.render('complaintData', { complaint , desc : priority.description});                          
    }
    
    res.render('complaintData', {complaint});
});

router.get('/closed/complaintData/:id', isLoggedIn , async (req, res)=> {
   
    let complaint = await closedComplaintModel.findOne({ _id: req.params.id}).populate("assignedWorker");

    await res.render('closedComplaint', { complaint });

});

router.get("/approveComplaint" ,isLoggedIn,async(req, res) =>{

    let complaints = await complaintModel.find({isApproved : false}).populate("user");
    let error = req.flash("error");
    let success = req.flash("success");
    
   
    await res.render("adminView/approveComplaint",{complaints,error,success});
    
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