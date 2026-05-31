const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    tags:[String],
    likes:{
        type:Number,
        default:0
    }
});

const PostModel = mongoose.model("Post", PostSchema);

module.exports = PostModel;