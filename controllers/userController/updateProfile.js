const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const userModel = require('../../models/user');
const { profile } = require('console');
const imagekit = require('../../config/imageKit');


const updateProfile = async (req, res) => {


    let {firstName,lastName,mobileNumber} = req.body ; 

    let user = await userModel.findOne({username: req.user.username})

    const file = req.file;

    // Check if a new file is uploaded
    if (req.file) {
        // Get the path to the current profile picture
        const currentProfile = req.user.profilePicture[1];

        // Proceed to delete the file using the retrieved fileId
        imagekit.deleteFile(currentProfile, function(deleteError, deleteResult) {
            if (deleteError) {
                console.log("Error deleting file:", deleteError);
            } else {
                console.log("File deleted successfully:", deleteResult);
            }
        });

    }

    // Upload file to ImageKit
    const result = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: "/profileImage",
        });

    // Update the user with the new profile picture
    user.profilePicture = [result.url,result.fileId];



    // Update other user fields
    user.firstName = firstName;
    user.lastName = lastName;
    user.mobileNumber = mobileNumber;

    // Save the updated user
    await user.save();

   
    await res.redirect("/user/profile")

}

module.exports = updateProfile;