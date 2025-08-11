// must be at the top
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.q37ghry.mongodb.net/${process.env.DB_NAME}`
  )
  .then(() => console.log("connected successfully to MongoDB via Mongoose"))
  .catch((err) => console.error(err));

// Define the schema; validator put in rating
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

// Create the model
const Post = mongoose.model("Post", postSchema);

// for the home/root route
app.get("/", async (req, res) => {
  // READ: Find all documents
  try {
    const posts = await Post.find({});
    res.render("home", {
      homeStart: homeStartingContent,
      posts: posts,
    });
    // console.log(posts);
  } catch (err) {
    console.error("error:", err);
    res.status(500).send("Error loading homepage.");
  }
});

// static pages
app.get("/about", function (req, res) {
  res.render("about", {
    about: aboutContent,
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    contact: contactContent,
  });
});

// Compose new post
app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", async (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  await post.save();
  console.log("Post saved to DB!");
  res.redirect("/");
});

// dynamic addresses
app.get("/posts/:postId", async (req, res) => {
  const requestedPostId = req.params.postId;
  // console.log(requestedPostId);
  try {
    const post = await Post.findOne({ _id: requestedPostId });
    // console.log(post);
    if (post) {
      res.render("post", { title: post.title, content: post.content });
      // console.log("match found!");
    } else {
      res.status(404).send("post not found!");
    }
  } catch (err) {
    res.status(500).send("server error!");
  }
});

// console.log("match found!");
//  console.log(req.params.postName);
//  console.log(newCompose);
//   res.send("Form submitted successfully!");
// });

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});
