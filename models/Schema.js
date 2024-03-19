const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const ListingSchema = new Schema({
    title: {
        type : String,
        required: true,
    },
    description : String,
    image : {
       url: String,
       filename: String
    },
    price : Number,
    location : String,
    country : String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    coordinates: {
        type: [Number],
        requires: true
    }
});

ListingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews }});
    }
})

const listing = mongoose.model("listing",ListingSchema);

module.exports = listing;