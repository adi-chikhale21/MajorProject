if(process.env.NODE_ENV != "production"){
    const dotenv = require('dotenv');
    dotenv.config();


}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const usersRouter = require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));

let dbUrl = process.env.AtlasDb_URL;

main().then(() => {
    console.log("DB is connected");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.Secret
    },
    touchAfter: 24 * 3600,
})

const sessionOpt = {
    store,
    secret: process.env.Secret,
    resave:false,
    saveUninitialized:true,
    cookie : {
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
}
app.use(session(sessionOpt));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.get("/demouser",async (req,res) => {
    let fakeuser = new User({
        email: "addc@gmail.com",
        username: "addc-demo"
    });

    let registered = await User.register(fakeuser,"1234");
    res.send(registered);
})
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",usersRouter);

// app.get("/testinglisting", async (req,res) => {
//     const data1 = new listing ({
//         title: "My home",
//         description: "fifan",
//         price: 1200,
//         location: "new Delhi",
//         country: "India"
//     });

    // await data1.save();
//     console.log(data1);
//     res.send("Saved Data")
// })

// app.get("/", (req,res) => {
//     res.send("Hi I am root");
// })

app.all("*", (req,res,next) => {
    throw new ExpressError(404,"Page Not Found");
})

//Error handling middleware
app.use((err,req,res,next) => {
    let{statusCode = 500,message = "Some error occured"} = err;
    res.status(statusCode).render("listings/error.ejs",{message});
});

app.listen(8080, () => {
    console.log("App is listening at port 8080");
})