var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require("body-parser");
var Campground = require("./models/campground");
var seedDB = require("./seeds");



//var Comment = require("./models/comment");
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
            res.render("index", {campgrounds: allCampgrounds});
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
    res.render("new.ejs")
});


app.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);

            res.render("show",{campground:foundCampground});
        };
    });
});




app.listen(port, function () {
    console.log("started:" + port);
});