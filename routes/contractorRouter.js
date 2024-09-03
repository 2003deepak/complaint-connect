const express = require('express');
const complaintModel = require('../models/complaint');
const priorityComplaintModel = require('../models/priorityComplaint');                                  
const workerModel = require('../models/worker');
const saveWorker = require('../controllers/contractorController/saveWorker');
const deleteWorker = require('../controllers/contractorController/deleteWorker');
const upload = require('../config/multer-config');
const isLoggedIn = require("../controllers/userController/isLoggedIn")
const assignToComplaint = require("../controllers/contractorController/assignToComplaint")
const router = express.Router();


router.use(async (req, res, next) => {
    try {
        // Count new users and unapproved complaints
        let complaintCount = await complaintModel.countDocuments({isApproved : true});

        // Set global variables
        res.locals.pendingComplaintCount = complaintCount;
        
        next();
    } catch (error) {
        console.error("Error in router.use:", error);
        next(error); // Pass the error to the Express error handler
    }
});




router.get('/dashboard', async (req, res)=> {

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

   
    res.render("contractorView/contractorDashboard" , {newComplaint,pendingComplaint,completedComplaint});
});

router.get('/complaintData/:id', async (req, res)=> {
   
    let complaint = await complaintModel.findOne({ _id: req.params.id}).populate("assignedWorker");
   
    if(complaint.isPriority){

        let priority = await priorityComplaintModel.findOne({ complaintId:req.params.id})
        console.log(priority)
        res.render('complaintData', { complaint , desc : priority.description});                          
    }

    res.render('complaintData', { complaint });
});


router.get('/addWorker', async (req, res)=> {

    let error = req.flash("error");
    let success = req.flash("success");

    res.render("contractorView/addWorker" , { error, success });
});

router.get("/manageWorker",isLoggedIn , async (req,res)=>{

    let workers = await workerModel.find();

    let error = req.flash("error");
    let success = req.flash("success");
    await res.render("contractorView/manageWorker" , {workers,error,success})
})

router.get("/pendingComplaint",isLoggedIn , async (req,res)=>{

    let complaints = await complaintModel.find({isApproved : true}).populate([
        { path: 'assignedWorker' },
        { path: 'user' }
    ]);

    let error = req.flash("error");
    let success = req.flash("success");
    
    await res.render("contractorView/pendingComplaint" , {complaints,error,success} )
    
    
})

router.get("/assignWorker/:id",isLoggedIn , async (req,res)=>{

    let complaints = await complaintModel.find({_id : req.params.id}).populate([
        { path: 'assignedWorker' },
        { path: 'user' }
    ]);

    let workers = await workerModel.find({work_area : complaints[0].complaintType})

   
    
    await res.render("contractorView/assignWorker" , {complaints , workers} )
    

    
    
})



router.post("/assignWorker/assignToComplaint/:id",isLoggedIn , assignToComplaint)


router.post('/addWorker/saveWorker', isLoggedIn ,upload.single('aadharCard') , saveWorker);

router.get("/manageWorker/deleteWorker/:id" , isLoggedIn , deleteWorker);


module.exports = router;
