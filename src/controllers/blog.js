const { validationResult } = require("express-validator");
const Blogpost = require("../models/blog");

// GET ALL DATA FROM DATABASE
exports.getAllData = (req, res, next) => {
  Blogpost.find()
    .then((result) => {
      res.status(200).json({
        message: "Get all data Blogpost success",
        data: result,
      });
    })
    .catch((err) => next(err));
};

// GET POST BY ID
exports.getDataById = (req, res, next) => {
  const id = req.params.id;
  Blogpost.findById(id)
    .then((result) => {
      if (!result) {
        console.log("Harusnya sih ini error");
        const err = new Error("Post tidak ditemukan");
        err.errorStatus = 404;
        throw err;
      }
      res.status(200).json({
        message: "Getting post by using ID is success",
        data: result,
      });
    })
    .catch((err) => next(err));
};

// UPLOAD DATA TO DATABSE
exports.post = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Invalid error data");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  if (!req.file) {
    const err = new Error("Image must uploaded");
    err.errorStatus = 422;
    throw err;
  }

  const { title, body } = req.body,
    image = req.file.path;

  // SAVING DATA TO MONGO DB
  const posting_data = new Blogpost({
    title,
    body,
    image,
    author: {
      uid: 1,
      name: "faulans",
    },
  });

  posting_data
    .save()
    .then((result) => {
      res.status(201).json({ message: "Uploading data success", data: result });
      next();
    })
    .catch((err) => console.log("Pesan Error:", err));
};
