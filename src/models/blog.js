const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogPost = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    author: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ("Model name", Model_Format)
module.exports = mongoose.model("Blog Post", BlogPost);
