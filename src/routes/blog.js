const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const { post, getAllData, getDataById } = require("../controllers/blog");

router.get("/posts", getAllData);
router.get("/post/:id", getDataById);
router.post(
  "/post",
  [
    body("title")
      .isLength({ min: 5 })
      .withMessage("Input title minimal 5 karakter"),
    body("body")
      .isLength({ min: 5 })
      .withMessage("Input body minimal 5 karakter"),
  ],
  post
);

module.exports = router;
