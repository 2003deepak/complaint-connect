const imagekit = require('../config/imageKit');


const cutAndPasteFile = async (fileId, destinationFolder) => {
    try {
        // Retrieve the file details
        const fileDetails = await imagekit.getFileDetails(fileId);

        if (!fileDetails || !fileDetails.url) {
            throw new Error("File not found or invalid file details.");
        }

        const fileUrl = fileDetails.url;

        // Upload the file to the destination folder
        const uploadedFile = await imagekit.upload({
            file: fileUrl, // You can also use the file's binary data or base64 string
            fileName: fileDetails.name, // Use the same file name
            folder: destinationFolder // Destination folder path
        });

        // Delete the original file after successful upload
        await imagekit.deleteFile(fileId);

        return uploadedFile;
    } catch (error) {
        console.error("Error in moving the file:", error);
        throw error;
    }
};

module.exports = cutAndPasteFile;