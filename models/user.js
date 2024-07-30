const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: { 
    type: String, 
    default: null 
  },
  lastName: { 
    type: String, 
    default: null 
  },
  username: { 
    type: String, 
    default: null 
  },
  password: { 
    type: String, 
    default: null 
  },
  email: { 
    type: String, 
    default: null 
  },
  mobileNumber: { 
    type: Number, 
    default: null 
  },
  buildingNumber: { 
    type: Number, 
    default: null 
  },
  roomNumber: { 
    type: Number, 
    default: null 
  },
  allotmentLetter: { 
    type: String, 
    default: null 
  },
  profilePicture: {
    type: String,
    default: "default.png"
  },
  isAllowed: { 
    type : Boolean,
    default: false
  }
});

module.exports = mongoose.model("user", userSchema);
