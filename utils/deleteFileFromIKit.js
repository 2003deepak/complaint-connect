const imagekit = require('../config/imageKit');


const deleteFileFromIKit = (id) =>{


    // Proceed to delete the file using the retrieved fileId

    imagekit.deleteFile(id, function(deleteError, deleteResult) {
        if (deleteError) {
            console.log("Error deleting file:", deleteError);
        } else {
            console.log(" File deleted successfully ");
        }
    });


}

module.exports = deleteFileFromIKit;


