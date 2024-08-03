const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAysnc = require("../utils/wrapAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

const reviewControllers = require("../controllers/review");


//Reviews
// - Post Review Route
router.post("/", isLoggedIn, validateReview, wrapAysnc(reviewControllers.createReview));

// - Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAysnc(reviewControllers.deleteReview));


module.exports = router;