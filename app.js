var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require("body-parser");

var mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/yelp_camp", {useNewUrlParser: true});

//schema setup

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);
//
// Campground.create({
//     name: "Granite Hill",
//     image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
//     description: "This is perfect"
// },function(err,campground){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(campground);
//     }
// });
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));



app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    Campground.find({},function(err, allCampgrounds){
        if(err){console.log(err);}
        else{res.render("index", {campgrounds: allCampgrounds});}
    });
    //
});


app.post("/campgrounds", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image}
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/index");
        }
    });
});

app.get("/campgrounds/new", function (req, res) {
    res.render("new.ejs")
});


app.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id,function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("show",{campground:foundCampground});
        };
    });
});




app.listen(port, function () {
    console.log("started:" + port);
});