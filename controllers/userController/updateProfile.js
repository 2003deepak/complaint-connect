const express = require('express');
const imagekit = require('../../config/imageKit');
const userModel = require('../../models/user');

const updateProfile = async (req, res) => {
    try {
        let { firstName, lastName, mobileNumber } = req.body;
        let user = await userModel.findOne({ username: req.user.username });

        // Check if a new file is uploaded
        if (req.file) {
            // Check if there's an existing profile picture to delete
            if (user.profilePicture && user.profilePicture[1]) {
                const currentProfileId = user.profilePicture[1];

                try {
                    // Delete the existing file from ImageKit
                    await imagekit.deleteFile(currentProfileId);
                    console.log("File deleted successfully:", currentProfileId);
                } catch (deleteError) {
                    console.error("Error deleting file:", deleteError);
                    req.flash("error", "Failed to delete the old profile picture.");
                }
            }

            try {
                // Upload new profile picture to ImageKit
                const result = await imagekit.upload({
                    file: req.file.buffer,
                    fileName: req.file.originalname,
                    folder: "/profileImage",
                });

                // Update the user with the new profile picture
                user.profilePicture = [result.url, result.fileId];
            } catch (uploadError) {
                console.error("Error uploading file:", uploadError);
                req.flash("error", "Failed to upload the new profile picture.");
                return res.redirect("/user/profile");
            }
        }

        // Update other user fields
        user.firstName = firstName;
        user.lastName = lastName;
        user.mobileNumber = mobileNumber;

        // Save the updated user
        await user.save();

        req.flash("success", "Profile updated successfully!");
        res.redirect("/user/profile");
    } catch (error) {
        console.error("Error updating profile:", error);
        req.flash("error", "Failed to update the profile. Please try again.");
        res.redirect("/user/profile");
    }
};

module.exports = updateProfile;
