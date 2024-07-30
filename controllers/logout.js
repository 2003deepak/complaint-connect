const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const router = express.Router();




const logout = async (req, res) => {

    res.clearCookie('token');
    res.redirect("/login")
}

module.exports = logout;