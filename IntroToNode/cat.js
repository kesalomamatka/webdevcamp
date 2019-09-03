var mongoose=require("mongoose");
mongoose.connect('mongodb://localhost:27017/demo', {useNewUrlParser: true});



var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
});
var Cat = mongoose.model("Cat", catSchema);
/*
var george = new Cat({
    name: "Dog",
    age: 2,
    temperament: "evil"
});

george.save(function (err, cat) {
    if (err) {
        console.log("something wrong");
    } else {
        console.log(cat);
}
});
*/
/*
Cat.find({"name":"Dog"},function(err,cats){
    if(err){console.log("nooooo");console.log(err);}
    else{console.log(cats);}
});
*/
Cat.create({
    name:"bitch",
    age:14,
    temperament:"bland"
},function(err,cat){
    if(err){
        console.log("err");
    }else{
        console.log(cat);
    }
});