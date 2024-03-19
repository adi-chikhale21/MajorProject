const User = require("../models/user.js");

module.exports.rendersignupForm = (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req,res) => {
    try{
    let {username,email,password} = req.body;
    const newUser = new User({email,username});
    let registered = await User.register(newUser,password);
    req.login(registered, (err) => {
        if(err){
            return next(err)
        }

    req.flash("success","Welcome to WanderLust");
    res.redirect("/listings");
    })
    }catch(e){
            req.flash("error",e.message);
            res.redirect("/signup");
    }
    
}

module.exports.renderLoginForm = (req,res)=> {
    res.render("users/login.ejs")
}

module.exports.login = async (req,res) => {
    req.flash("success","Welcome back to WanderLust");
    let redirect = res.locals.redirect || "/listings"
    res.redirect(redirect)
 }

 module.exports.logout = (req,res,next) => {
    req.logOut((err) => {
        if(err){
            return next(err)
        }
        req.flash("success","You are Logged out")
        res.redirect("/listings");
    })
}