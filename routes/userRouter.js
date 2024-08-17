const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config')
const userRegistration = require('../controllers/userController/userRegistration');
const userModel = require('../models/user');
const complaintModel = require('../models/complaint');
const closedComplaintModel = require('../models/closedComplaint');
const loginAuth = require('../controllers/userController/loginAuth');
const isLoggedIn = require('../controllers/userController/isLoggedIn');
const updateProfile = require('../controllers/userController/updateProfile');  
const fileComplaint = require('../controllers/userController/fileComplaint');      
const sendOTP = require('../utils/sendOTP');  
const checkPassword = require('../controllers/userController/checkPassword');     
const setNewPassword = require('../controllers/userController/setNewPassword');
const endComplaint = require('../controllers/userController/endComplaint');
const relodgeComplaint = require('../controllers/userController/relodgeComplaint');

router.post('/signup',upload.single('allotment'), userRegistration);
router.post('/login',loginAuth);


router.get('/dashboard',isLoggedIn,async(req,res)=>{

    let newComplaint = await complaintModel.find({
        user: req.user._id,
        resolvedAt: null,
        updatedAt: null,
        isApproved: true
    });

    let pendingComplaint = await complaintModel.find({
        user: req.user._id,
        resolvedAt: null,
        updatedAt: { $ne: null }, // Not equal to null
        isApproved: true
    });

    let completedComplaint = await complaintModel.find({
        user: req.user._id,
        resolvedAt: { $ne: null },
        updatedAt: { $ne: null }, // Not equal to null
        isApproved: true
    });

    await res.render("userView/userDashboard" , {newComplaint,pendingComplaint,completedComplaint,user : req.user});
});



router.get('/complaintData/:id', async (req, res)=> {

    
        let complaint = await complaintModel.findOne({ _id: req.params.id}).populate("assignedWorker");
        await res.render('complaintData', { complaint });
    
});

router.get('/closedComplaint/:id', async (req, res)=> {

    
        let complaint = await closedComplaintModel.findOne({ _id: req.params.id}).populate("assignedWorker");
        await res.render('closedComplaint', { complaint });
   
   
   
});

router.get('/profile',isLoggedIn,async(req,res)=>{

    res.render("userView/profile" ,{user : req.user})

});

router.get('/complaint',isLoggedIn,async(req,res)=>{
    res.render("userView/complaint" ,{user : req.user})
})

router.get('/complaintHistory',isLoggedIn,async(req,res)=>{

    let complaint = await complaintModel.find({
        user : req.user._id 
    })

    
    await res.render("userView/complaintHistory" , {complaint , user : req.user})
    

})

router.get('/updatePassword',isLoggedIn,async(req,res)=>{

   
    res.render("userView/updateCurrentPassword" , {user : req.user });
    

})

router.get('/closedComplaint',isLoggedIn,async(req,res)=>{

    let complaints = await closedComplaintModel.find({ user: req.user._id }).populate([{ path: 'user' }, { path: 'assignedWorker' }]);


    res.render("userView/closedComplaint" , {complaints ,user : req.user});
    

})

router.get('/review/:id',isLoggedIn,async(req,res)=>{

   
    res.render("userView/satisfied" , {id : req.params.id});
    

})


router.post('/profile/updateProfile',isLoggedIn,upload.single('profile_image'),updateProfile);

router.post('/complaint/fileComplaint',isLoggedIn,upload.single('complaint_image'),fileComplaint);

router.post('/updatePassword/auth',isLoggedIn,checkPassword);
router.post('/updatePassword/verify',isLoggedIn,setNewPassword);
router.post('/endComplaint/:id',isLoggedIn,endComplaint);
router.post('/relodgeComplaint/:id',isLoggedIn,relodgeComplaint);





module.exports = router;
