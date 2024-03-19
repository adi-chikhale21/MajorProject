const express = require("express");
const router = express.Router();
const Wrapasync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js")
const ListingController = require("../controllers/listing.js")
const multer  = require('multer')
const {storage} = require("../cloudconfig.js")
const upload = multer({storage})


router.route("/")
.get(Wrapasync(ListingController.Index))
.post(isLoggedIn,upload.single('Listing[image]'),validateListing, Wrapasync(ListingController.createListing))

//New Route
router.get("/new", isLoggedIn,ListingController.renderCreateForm);

router.route("/:id")
.get(Wrapasync(ListingController.showListing))
.put(isLoggedIn,isOwner,upload.single('Listing[image]'),validateListing, Wrapasync(ListingController.updateListing))
.delete(isLoggedIn,isOwner,Wrapasync(ListingController.destroyListing));

// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, Wrapasync(ListingController.editListing))


module.exports = router;