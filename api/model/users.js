const mongoose = require("mongoose");

const userSchema =new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,unique:true},
    password:{type:String}
})

module.exports = new mongoose.model("users",userSchema)