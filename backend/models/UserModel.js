const mongosse = require("mongoose");

const UserSchmea = new mongosse.Schema({
    name: {type:String, required:true},
    email:{type:String, required: true, unique:true},
    password:{type:String, required:true},
    role:{type: String, enum:["admin", "user"], default:"user", required: true}
});

const UserModel = mongoose.model("User", UserSchmea);

module.exports = UserModel;