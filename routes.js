~"use strict";

const express = require("express");
const router = express.Router();

const accounts = require("./controllers/accounts.js");
const dashboard = require("./controllers/dashboard.js");
const about = require("./controllers/about.js");
const pi = require("./controllers/pi.js");
const station = require("./controllers/station.js");


router.get("/", accounts.index);
router.get("/login", accounts.login);
router.get("/signup", accounts.signup);
router.get("/logout", accounts.logout);
router.post("/register", accounts.register);
router.post("/authenticate", accounts.authenticate);
router.get("/about", about.index);
router.get("/pi", pi.index1);
router.get("/dashboard", dashboard.index);
router.get("/dashboard/deletestation/:id", dashboard.deleteStation);
router.post("/dashboard/addstation", dashboard.addStation);
router.get("/editprofile", accounts.editProfile);
router.post("/updateprofile", accounts.updateProfile);

router.get("/station/:id", station.index);
router.get("/station/:id/deletereading/:readingid", station.deleteReading);
router.post("/station/:id/addreading", station.addReading);
router.post("/station/:id/addreport", station.addreport);

module.exports = router;
