const multer = require("multer");
const path = require("path");

// Multer upload configuration
const upload = multer({ dest: 'public/userUpload' });

module.exports = upload;