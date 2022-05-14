const { validationResult } = require("express-validator");
const Blogpost = require("../models/blog");
const path = require("path");
const fs = require("fs");

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
  const _id = req.params.id;
  Blogpost.findById(_id)
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
exports.uploadData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Invalid error data");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  if (!req.file) {
    const err = new Error("Image must be uploaded");
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

// UPDATE DATA TO DATABASE
exports.updateDataById = (req, res, next) => {
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
    image = req.file.path,
    _id = req.params.id;
  console.log(_id);

  // SAVING DATA TO MONGO DB
  Blogpost.findById(_id)
    .then((post) => {
      console.log("Cmeweww");
      if (!post) {
        const err = new Error("Blog Post not found");
        err.errorStatus = 404;
        throw err;
      }

      post.title = title;
      post.body = body;
      post.image = image;

      return post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Update post success",
        data: result,
      });
    })
    .catch((err) => next(err));
};

exports.deletePost = (req, res, next) => {
  const _id = req.params.id;

  Blogpost.findById(_id)
    .then((post) => {
      if (!post) {
        const err = new Error("Postingan tidak ditemukan");
        err.errorStatus = 404;
        throw err;
      }
      deleteImage(post.image);
      return Blogpost.findByIdAndRemove(_id);
    })
    .then((data) =>
      res.status(200).json({ message: "Deleting file is success", data })
    )
    .catch((err) => next(err));
};

const deleteImage = (filePath) => {
  const data = path.join(`${__dirname}../../../${filePath}`);
  fs.unlink(data, (err) => console.log("ERROR :", err));
};
