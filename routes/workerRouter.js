const express = require('express');
const router = express.Router();
const complaintModel = require("../models/complaint")
const workerActionModel = require("../models/workerAction")                                                
const loginAuth = require('../controllers/workerController/loginAuth');
const isLoggedIn = require("../controllers/userController/isLoggedIn")
const takeAction = require("../controllers/workerController/takeAction");
const initialVisitDone = require("../controllers/workerController/initialVisitDone");
const closeComplaint = require("../controllers/workerController/closeComplaint")
const checkPassword = require("../controllers/workerController/checkPassword");
const setNewPassword = require("../controllers/workerController/setNewPassword");
const upload = require("../config/multer-config")

router.use(isLoggedIn, async (req, res, next) => {
    try {
        // Count pending complaints assigned to the current user
        let pComplaintCount = await workerActionModel.countDocuments({
            workerAssigned: req.user._id,
            actionTaken: true,
            completed : false,
            
        });

        

        let nComplaintCount = await workerActionModel.countDocuments({
            workerAssigned: req.user._id,
            actionTaken: false,
           
        });

        // Set global variable
        res.locals.pendingComplaintCountW = pComplaintCount;
        res.locals.newComplaintCountW = nComplaintCount;

    
        next();
    } catch (error) {
        console.error("Error in router.use:", error);
        next(error); // Pass the error to the Express error handler
    }
});




router.post('/login',loginAuth);

router.get('/dashboard',isLoggedIn,async(req,res)=>{

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




    await res.render("workerView/workerDashboard" , {newComplaint,pendingComplaint,completedComplaint,user : req.user});
});

router.get('/complaintData/:id', async (req, res)=> {
   
    let complaint = await complaintModel.findOne({ _id: req.params.id}).populate("assignedWorker");
    res.render('complaintData', { complaint });
});

router.get('/newComplaint' ,isLoggedIn,async (req,res)=>{

    let newComplaint = await workerActionModel.find({
        workerAssigned: req.user._id,
        actionTaken: false,
       
    }).populate([
        { path: 'complaintId' },
        { path: 'workerAssigned' }
    ]);

 
    await  res.render("workerView/newComplaint" , {newComplaint})
})

router.get('/pendingComplaint' ,isLoggedIn,async (req,res)=>{


    let pendingComplaint = await workerActionModel.find({
        workerAssigned: req.user._id,
        actionTaken: true,
        completed : false,
        
    }).populate([
        { path: 'complaintId' },
        { path: 'workerAssigned' }
    ]);

 
    await  res.render("workerView/pendingComplaint" , {pendingComplaint})
})

router.get('/closeComplaint/:id' ,isLoggedIn, (req,res)=>{
    res.render("workerView/closeComplaint" , {id : req.params.id})
})


router.get('/updatePassword',isLoggedIn,async(req,res)=>{

   
    res.render("workerView/updateCurrentPassword" , {user : req.user });
    

})


router.get('/takeAction/:id' ,isLoggedIn, takeAction)


router.post('/updatePassword/auth',isLoggedIn,checkPassword);
router.post('/updatePassword/verify',isLoggedIn,setNewPassword);

router.post("/takeAction/initialVisitDone/:id" , isLoggedIn, initialVisitDone)
router.post("/takeAction/closeComplaint/:id" , isLoggedIn,upload.single('resolved_complaint'), closeComplaint)




module.exports = router;
