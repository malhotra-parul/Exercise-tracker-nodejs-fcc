const mongoose = require("mongoose");
const shortId = require("shortid");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    "username": {type: String },
    "_id": {type: String, default: shortId.generate()},
    "count": {type: Number, default:0},
    "log":[
      {"description": {type: String},
      "duration": {type: Number},
       "date": {type: Date, default: Date.now}
      }]
  });

module.exports = mongoose.model("User", userSchema);