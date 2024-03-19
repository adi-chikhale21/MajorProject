const listing = require("../models/Schema")
const ExpressError = require("../utils/ExpressError.js");
const axios = require('axios');
const mapToken = process.env.Map_Token

async function geocode(address) {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      if (!response.data || response.data.length === 0) {
        throw new Error('No results found for the provided address');
      }
      const { lat, lon } = response.data[0];
      return { latitude: lat, longitude: lon };
    } catch (error) {
      throw new Error('Error fetching geocoding data: ' + error.message);
    }
  }

module.exports.Index = async (req,res,next) => {
    const allListing = await listing.find({});
    res.render("listings/home.ejs", {allListing});
    
}

module.exports.renderCreateForm = (req,res) => {
    res.render("listings/new.ejs");
}

module.exports.createListing = async (req,res,next) => {
   let coordinates=  await geocode(`${req.body.Listing.location}`)
  
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = await new listing(req.body.Listing);
    newlisting.image = {url,filename};
    newlisting.owner = req.user._id;
    newlisting.coordinates = [coordinates.longitude,coordinates.latitude];
    await newlisting.save();
    console.log(newlisting);
    req.flash("success","New listing created!")
    res.redirect("/listings");  
}

module.exports.showListing = async (req,res) => {
    const {id} = req.params;
    const Listing = await listing.findById(id).populate({path: "reviews",populate: {path: "author"}}).populate("owner");
    if(!Listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");  
    }else{
        res.render("listings/show.ejs", {Listing});
    }
    
}

module.exports.editListing = async(req,res) => {
    let {id} = req.params;
    const Listing = await listing.findById(id);
    if(!Listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");  
    }

    let originalImageLink = Listing.image.url;
    originalImageLink = originalImageLink.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", {Listing,originalImageLink});
    
}

module.exports.updateListing = async (req,res) => {
    if(!req.body.Listing){
        next(new ExpressError(400,"Bad request"))
    }
    let {id} = req.params;
    let Listing = await listing.findById(id);
    if(! Listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing.");
        return res.redirect(`/listings/${id}`);
    }
    await listing.findByIdAndUpdate(id,{...req.body.Listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        Listing.image = {url,filename};
        await Listing.save();
    }
    req.flash("success","Listing Updated!")
    res.redirect(`/listings/${id}`)
}

module.exports.destroyListing = async (req,res) => {
    let {id} = req.params;
    let deleted = await listing.findByIdAndDelete(id);
    console.log(deleted);
    req.flash("success","Listing Deleted!")
    res.redirect("/listings");
}