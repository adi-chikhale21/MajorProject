const express = require("express");
const router = express.Router({mergeParams: true});
const Wrapasync = require("../utils/wrapAsync.js");
const {validateReview,isReviewAuthor,isLoggedIn} = require("../middleware.js");
const reviewController = require("../controllers/review.js")

// Review 
// Add review route
router.post("/",validateReview, isLoggedIn,Wrapasync(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,Wrapasync(reviewController.destroyReview))

module.exports = router;