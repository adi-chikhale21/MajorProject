const listing = require("../models/Schema.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req,res) => {
    console.log(req.params.id);
    let Listing = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    Listing.reviews.push(newReview);
    
    await newReview.save();
    await Listing.save();

    req.flash("success","New Review added!")
    res.redirect(`/listings/${Listing._id}`);
}

module.exports.destroyReview = async(req,res) => {
    let{id,reviewId} = req.params;
    let res1 = await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    let res2 = await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!")
    res.redirect(`/listings/${id}`);
}