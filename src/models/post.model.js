import mongoose, { Schema } from "mongoose";

let postSchema = new mongoose.Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' // Make sure this matches the name of your user model
    },
    title : {
        type : String, required : true
    },
    description : {
        type : String, required : true
    },
    views : {
        type : Number, required:true,
    },
    videoUrl : {
        type : String, required : true
    },
    video_id : {
        type : String, required : true
    }
})
let postModel = new mongoose.model('post', postSchema);
export {postModel}