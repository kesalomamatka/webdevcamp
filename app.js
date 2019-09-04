var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require("body-parser");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user")

app.use(require("express-session")({
    secret:"top secret here",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
//User.authenticate() from user.js passportLocalMongoose
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


var Comment = require("./models/comment");
//var User = require("./models/user");


var mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/yelp_camp", {useNewUrlParser: true});
seedDB();
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"))


app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    Campground.find({},function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
    //
});


app.post("/campgrounds", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;

    var newCampground = {name: name, image: image, description:description}
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new")
});


app.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);

            res.render("campgrounds/show",{campground:foundCampground});
        };
    });
});

// ==============
// COMMENTS ROUTES
// ==============

app.get("/campgrounds/:id/comments/new", function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground:campground});
        }
    })

    //res.render("comments/new");
    //res.send();
});

app.post("/campgrounds/:id/comments",function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }else{
            console.log(req.body.comment);
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            })

        }
    })
})

//===========
//AUTH ROUTES
//===========


app.get("/register",function (req,res){
    res.render("register");
})
//local mongoose

app.post("/register",function (req,res){
    var newUser = new User({username: req.body.username});
    //store hash
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/campgrounds");

            })
        }
    })
})

app.listen(port, function () {
    console.log("started:" + port);
});