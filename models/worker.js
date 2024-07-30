const mongoose = require('mongoose');
const { PassThrough } = require('nodemailer/lib/xoauth2');

const workerSchema = mongoose.Schema({



      username : String,
      password : String,
      email : String,
      aadhar_card : String,
      mobile_number : {
        type: Number,
        default: null
      },
      address : {
        type: String,
        default: null
      },
      pincode : {
        type: Number,
        default: null
      },
      name : {
        type: String,
        default: null
      },
      last_name : {
        type: String,
        default: null
      },
      work_area : String,
      createdAt: {
        type: Date,
        default: Date.now
      }

});

module.exports = mongoose.model("worker", workerSchema);