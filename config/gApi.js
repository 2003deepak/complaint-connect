const { google } = require('googleapis');
const path = require('path');

// Load service account key
const KEY_FILE_PATH = path.join(__dirname, 'apiKey.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE_PATH,
    scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

module.exports = drive;
