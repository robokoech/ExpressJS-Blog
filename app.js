
const mongoose = require("mongoose");

//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

var _ = require('lodash');

const homeStartingContent = "This blog style website was created as a way for me to practice using Express.js in collaboration with a MongoDB database. I am able to compose blog posts by either writing within the websites composition portal or by adding to the database directly. The header and footer were created using bootstrap. Click around and Enjoy :)";
const aboutContent = "I’m a recent Duke University grad, with a major in Computer Science and a minor in Environmental Science. Growing up in sunny Albuquerque New Mexico I was introduced to a wide variety of different cultures and perspectives, many of which influence the work that I create today. I’m fascinated with using technology to innovate + create, and passionate about streetwear and travel.";
const contactContent = "Robert.Koech@duke.edu";

const app = express();

const posts =[];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//create a new db//
mongoose.connect("mongodb+srv://admin-rob:Lakers123@cluster0.gkjid.mongodb.net/blogDB2", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

//create a new Schema
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});

//next we need a model
const Post = mongoose.model("Post", postSchema);

const testPost = new Post({
  title: "This is an example title",
  body: "hey yo big body bes"

});

//estPost.save()
app.get("/", function(req, res) {


  Post.find({}, function(err, foundItems) {

    //mongoose.connection.close();
    //using the for each we are printing each name
    //console.log(foundItems.name);

      res.render("home", {homePageContent: homeStartingContent, postsAdded: foundItems});

  });

  //res.render("home", {homePageContent: homeStartingContent, postsAdded: posts});


});

app.get("/posts/:postName", function(req, res) {
//moderrn code
//   if (posts.some(e => e.newTitle === req.params.postName )) {
//   /* vendors contains the element we're looking for */
//   console.log("Match found");
// }
//this is how we access the thing someone typed
const requestedTitle = req.params.postName;

Post.findOne({title:requestedTitle}, function(err, foundPost){
  const title = foundPost.title;
  const body = foundPost.body;
  res.render("post", {individualTitle: title, individualBody: body});

});


  // if (_.lowerCase(title) === (_.lowerCase(requestedTitle)) ){
  //   res.render("post", {individualTitle: title, individualBody: body});
  // }
  });




app.get("/contact", function(req, res) {

  res.render("contact", {contactText: contactContent});

});

app.get("/about", function(req, res) {

  res.render("about", {aboutText: aboutContent});

});

app.get("/compose", function(req, res) {

  res.render("compose");

});

app.post("/compose",function(req,res){
  let newTitleText = req.body.newTitleEntry;
  let newBodyText = req.body.newBodyEntry;

  // const post = {
  //   newTitle: newTitleText,
  //   newBody: newBodyText
  // };

  const dbPost = new Post({
    title: newTitleText,
    body: newBodyText
  });

 dbPost.save(function(err, doc) {
  if (err) {console.log(err);
  }else{
    res.redirect("/");
  };
});
  // posts.push(post);




});





let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function() {
  console.log("Server started");
});
