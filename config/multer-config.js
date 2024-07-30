const multer = require("multer");
const path = require("path");

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Determine destination folder based on file type
        let uploadPath = 'public/userUpload'; // Default path

        // Check file type and set uploadPath accordingly
        if (file.fieldname === 'aadharCard') {
            uploadPath = 'public/userUpload/aadhar_card';
        }else if (file.fieldname === 'allotment'){
          uploadPath = 'public/userUpload/allotment_letter';
        }else if (file.fieldname === 'profile_image'){
            uploadPath = 'public/userUpload/profile_image';
        }else if (file.fieldname === 'complaint_image'){
            uploadPath = 'public/userUpload/complaint_image';
        }else if (file.fieldname === 'resolved_complaint'){
            uploadPath = 'public/userUpload/resolved_complaint';
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Generate a unique filename using the current timestamp and the original filename extension.
        const filename = Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});

// Multer upload configuration
const upload = multer({ storage: storage });

module.exports = upload;
