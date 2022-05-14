const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
// TAKE CARE OF THE IMAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// MIDDLEWERE
app.use(bodyParser.json()); //type JSON
app.use(multer({ storage, fileFilter }).single("image")); //MULTER TO TAKE CARE OF IMAGES
app.use("/images", express.static(path.join(__dirname, "images"))); // TO ACCESS IMAGE

// Allow access from other link
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"),
    res.setHeader("Access-Control-Allow-Method", "GET,POST,PUT,PATCH,DELETE"),
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
  next();
});

// ROUTING
const auth_routes = require("./src/routes/auth");
const blog_routes = require("./src/routes/blog");

app.use("/v1/auth", auth_routes);
app.use("/v1/blog", blog_routes);

// IF SOMETHING ERROR
app.use((error, req, res, next) => {
  const status = error.errorStatus || 500,
    message = error.message,
    data = error.data;

  res.status(status).json({ message, data });
});

// SETUP TO MONGODB
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://TeknologiHH:6PXQ5MPp48ci0AV6@cluster0.bkxn5.mongodb.net/BLOG?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(3000, () => console.log(`App is listening on port 3000`));
  })
  .catch((err) => console.log(err));
