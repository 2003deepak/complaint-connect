const express = require('express');
const router = express.Router();
const complaintModel = require("../models/complaint")
const workerActionModel = require("../models/workerAction")   
const priorityComplaintModel = require("../models/priorityComplaint");                                             
const loginAuth = require('../controllers/workerController/loginAuth');
const isLoggedIn = require("../controllers/userController/isLoggedIn")
const takeAction = require("../controllers/workerController/takeAction");
const initialVisitDone = require("../controllers/workerController/initialVisitDone");
const closeComplaint = require("../controllers/workerController/closeComplaint")
const checkPassword = require("../controllers/workerController/checkPassword");
const setNewPassword = require("../controllers/workerController/setNewPassword");
const upload = require("../config/multer-config")

async function setGlobalVariables(req, res, next) {
    try {
        // Count pending complaints assigned to the current user
        let pComplaintCount = await workerActionModel.countDocuments({
            workerAssigned: req.user._id,
            actionTaken: true,
            completed: false,
        });

        let nComplaintCount = await workerActionModel.countDocuments({
            workerAssigned: req.user._id,
            actionTaken: false,
        });

        // Set global variables
        res.locals.pendingComplaintCountW = pComplaintCount;
        res.locals.newComplaintCountW = nComplaintCount;

        next();
    } catch (error) {
        console.error("Error in setGlobalVariables:", error);
        next(error);
    }
}




router.post('/login',loginAuth);

router.get('/dashboard',isLoggedIn,setGlobalVariables,async(req,res)=>{

    let newComplaint = await workerActionModel.find({
        workerAssigned: req.user._id,
        actionTaken: false,
       
    }).populate([
        { path: 'complaintId' },
        { path: 'workerAssigned' }
    ]);

    let pendingComplaint = await workerActionModel.find({
        workerAssigned: req.user._id,
        actionTaken: true,
        completed : false,
        
    }).populate([
        { path: 'complaintId' },
        { path: 'workerAssigned' }
    ]);

    let completedComplaint = await workerActionModel.find({
        workerAssigned: req.user._id,
        actionTaken: true,
        completed : true,
    }).populate([
        { path: 'complaintId' },
        { path: 'workerAssigned' }
    ]);


    let error = req.flash("error");
    let success = req.flash("success");

    await res.render("workerView/workerDashboard" , {newComplaint,pendingComplaint,completedComplaint,user : req.user,error,success});
});

router.get('/complaintData/:id', isLoggedIn,setGlobalVariables,async (req, res)=> {
   
    let complaint = await complaintModel.findOne({ _id: req.params.id}).populate("assignedWorker");

    if(complaint.isPriority){

        let priority = await priorityComplaintModel.findOne({ complaintId:req.params.id})
        await res.render('complaintData', { complaint , desc : priority.description});                          
    }
    res.render('complaintData', { complaint});
});

router.get('/newComplaint' ,isLoggedIn,setGlobalVariables,async (req,res)=>{

    let newComplaint = await workerActionModel.find({
        workerAssigned: req.user._id,
        actionTaken: false,
       
    }).populate([
        { path: 'complaintId' },
        { path: 'workerAssigned' }
    ]);

    let error = req.flash("error");
    let success = req.flash("success");

 
    await  res.render("workerView/newComplaint" , {newComplaint,error,success});
})

router.get('/pendingComplaint' ,isLoggedIn,setGlobalVariables,async (req,res)=>{


    let pendingComplaint = await workerActionModel.find({
        workerAssigned: req.user._id,
        actionTaken: true,
        completed : false,
        
    }).populate([
        { path: 'complaintId' },
        { path: 'workerAssigned' }
    ]);

    let error = req.flash("error");
    let success = req.flash("success");

 
    await  res.render("workerView/pendingComplaint" , {pendingComplaint , error, success});
})

router.get('/closeComplaint/:id' ,isLoggedIn, setGlobalVariables,(req,res)=>{
    res.render("workerView/closeComplaint" , {id : req.params.id})
})


router.get('/updatePassword',isLoggedIn,setGlobalVariables,async(req,res)=>{

   
    res.render("workerView/updateCurrentPassword" , {user : req.user });
    

})


router.get('/takeAction/:id' ,isLoggedIn, setGlobalVariables,takeAction)


router.post('/updatePassword/auth',isLoggedIn,setGlobalVariables,checkPassword);
router.post('/updatePassword/verify',isLoggedIn,setNewPassword);

router.post("/takeAction/initialVisitDone/:id" , isLoggedIn, setGlobalVariables,initialVisitDone)
router.post("/takeAction/closeComplaint/:id" , isLoggedIn,upload.single('resolved_complaint'),setGlobalVariables, closeComplaint)




module.exports = router;
