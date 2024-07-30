const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const userModel = require('../../models/user');
const { profile } = require('console');


const updateProfile = async (req, res) => {


    let {firstName,lastName,mobileNumber} = req.body ; 

    let user = await userModel.findOne({username: req.user.username})

   
    

   // Check if a new file is uploaded
   if (req.file) {
    // Get the path to the current profile picture
    const currentProfilePicturePath = path.join(__dirname, '..', 'public/userUpload/profile_image', req.user.profilePicture);

    console.log(currentProfilePicturePath)

    fs.unlink(currentProfilePicturePath,(err)=>{
        if(err) console.error("Error Deleting");
        
    }) 

    // Update the user with the new profile picture
    user.profilePicture = req.file.filename;

}

    // Update other user fields
    user.firstName = firstName;
    user.lastName = lastName;
    user.mobileNumber = mobileNumber;

    // Save the updated user
    await user.save();

   
    await res.redirect("/user/profile")

}

module.exports = updateProfile;