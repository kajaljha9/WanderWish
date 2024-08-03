const express = require("express");
const router = express.Router();
const wrapAysnc = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
    //Index Route
    .get(wrapAysnc(listingController.index))
    //Create Route
    //.post("/", isLoggedIn, validateListing, wrapAysnc(listingController.createListing));
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAysnc(listingController.createListing));


//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    //Show Route
    .get(wrapAysnc(listingController.showListing))
    //Update Route
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAysnc(listingController.updateListing))
    //Delete Route
    .delete(isLoggedIn, isOwner, wrapAysnc(listingController.deleteListing));


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAysnc(listingController.renderEditForm));

module.exports = router;