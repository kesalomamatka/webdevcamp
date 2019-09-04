var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require("body-parser");
var Campground = require("./models/campground");
var seedDB = require("./seeds")



var Comment = require("./models/comment");
//var User = require("./models/user");


var mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/yelp_camp", {useNewUrlParser: true});
seedDB();
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));



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


app.listen(port, function () {
    console.log("started:" + port);
});