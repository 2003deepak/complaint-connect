const express = require('express');
const bcrypt = require('bcrypt');
const logout = require('../controllers/logout');
const userModel = require('../models/user');
const complaintModel = require('../models/complaint');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const sendOTP = require('../utils/sendOTP');
const generateOTP = require('../utils/generateOTP');
const router = express.Router();




router.get('/', (req, res)=> {

    
    res.render("index");
});


router.get('/signup', (req, res)=> {
    res.render("signup");
});

router.get('/forgot', (req, res)=> {
    res.render("forgot");
});

router.get('/login', (req, res)=> {
    const credentials = req.cookies.credentials || false;
    let error = req.flash("error");
    res.render('login', { credentials,error});
});

router.post("/getComplaintDetails", async (req, res) => {
    const complaintID = req.body.complaintId;
    const complaint = await complaintModel.findOne({ complaintId: complaintID });

   
    const decoded = jwt.verify(req.cookies["token"], process.env.JWT_KEY);

    await res.render('partials/complaintDetails', { complaint , role : decoded.role});
   
});

router.post("/forgot/verify", async (req, res) => {
    
    const email = req.body.email;

    const user = await userModel.findOne({ email: email });

    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }

    let otp = generateOTP();


    let msg = `<html>
            <head>
                <title>OTP For Password Reset</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                    }
                    .container {
                        margin: 0 auto;
                        padding: 20px;
                        max-width: 600px;
                        border: 1px solid #ddd;
                        border-radius: 10px;
                    }
                    .header {
                        background-color: #FF9F00;
                        padding: 10px;
                        text-align: center;
                        border-bottom: 1px solid #ddd;
                    }
                    p{
                        font-size: 16px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .footer {
                        margin-top: 20px;
                        text-align: center;
                        color: #888;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Initial Visit Verification</h1>
                    </div>
                    <div class="content">
                        <p>Dear ${user.username},</p>
                        <p>Your OTP is:</p>
                        <div style="font-size: 24px; font-weight: bold; margin: 10px 0; color: #4CAF50;">${otp}</div>
                        <p style="font-size: 14px; color: #666;">This OTP is valid for 5 minutes.</p>
                        
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                    </div>
                </div>
            </body>
        </html>` ; 

    res.cookie('otp', otp, { maxAge: 60000 * 5, httpOnly: true })
    sendOTP(email,"OTP Verification", msg);

    
    res.render('forgot' , {otpsent : true , email : email});
    
   
});

router.post("/verify/otp/:email", async (req, res) => {
    
    const otp = req.body.otp;


    if (otp === req.cookies.otp) {


        res.clearCookie('otp');
        res.render("reset" , {email : req.params.email});
    } else {
        return res.status(401).json({ message: 'Invalid OTP.' });
        
    }



});

router.post("/reset/password/:email", async (req, res) => {
    
    let {password , new_password} = req.body ; 

    if(password === new_password){
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, async (err, hash)=> {
    
                let user = await userModel.findOneAndUpdate({email : req.params.email},{password : hash})
                await res.redirect("/login");
            });
        });
    }else{
        return res.status(401).json({ message: 'Password not matching '});
    }




});

router.get('/logout',logout);


module.exports = router;
