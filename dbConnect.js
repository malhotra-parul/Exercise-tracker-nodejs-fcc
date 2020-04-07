const mongoose = require("mongoose");
const config = require("config");
const mongoUri = config.get("mongoUri");
mongoose.connect(mongoUri,{useNewUrlParser: true , useUnifiedTopology: true }, (err)=> {
    if(err) throw err;
    console.log("DB connected!");
});