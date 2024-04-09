import { ApiResponse } from "../utils/apiResponse.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { cloudinaryUpload, destroyFile } from "../utils/cloudinary.upload.js";
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';
import axios from 'axios';
import { postModel } from "../models/post.model.js";
import { userModel } from "../models/user.model.js";
import mongoose from "mongoose";

let VideoUpload =  AsyncHandler(async (req,res) =>{
    
  let {title, description} = req.body;
  let video = req.files.video[0].path;
    
  // const videoStream = fs.createReadStream(video);
  // let totalBytesUploaded = 0;
  // res.setHeader('X-Accel-Buffering', 'no');

  // Track upload progress using the file stream
  // videoStream.on('data', (chunk) => {
  //   totalBytesUploaded += chunk.length;
  //   const progress = (totalBytesUploaded / req.files.video[0].size) * 70;
  //   console.log(`Upload progress: ${progress.toFixed(2)}%`);
  //   res.write(`data: ${JSON.stringify({ progress })}\n\n`);
  //   res.flush();
  // });

  // Handle 'end' event when upload is complete
  // videoStream.on('end',async () => {
  //   console.log('Upload complete');
  //   videoStream.close();

  //   let cloud = await cloudinaryUpload(video, 'videoUploader');
  //   let createPost = await postModel.create({author : req.user._id,title, description,views:0,videoUrl : cloud.url, video_id:cloud.public_id});
  
  //   res.write(`data: ${JSON.stringify({ success: true, message: 'Uploaded Successfully' })}\n\n`);
  //   res.end();
  // });


  let cloud = await cloudinaryUpload(video, 'videoUploader');
  let createPost = await postModel.create({author : req.user._id,title, description,views:0,videoUrl : cloud.url, video_id:cloud.public_id});
  res.json({success : true, message : 'File Uploaded Successfully'});
})

let getAllPost = async(req,res)=>{
  let allPosts = await postModel.find().populate('author','username');
  res.json({success:true, posts : allPosts});
}

let deleteFromCloudinary = AsyncHandler(async (req,res)=>{
    let public_id = req.body.public_id;
    let isDeleted =await destroyFile([public_id])
    if(isDeleted){
        console.log('file deleted ')
    }
})





let getData = AsyncHandler(async (req,res) => {
        // let {video_url} = req.body;
        let video_id = req.params.id;
        let video = await postModel.findById(video_id);
        let video_url = video.videoUrl;
      
        const videoStreamUrl = cloudinary.url(video_url,
          { resource_type: 'video', streaming_profile: 'full_hd' });
          res.setHeader('Cache-Control', 'no-store');
        // Proxy the video stream from Cloudinary to the client
      
          const response = await axios.get(videoStreamUrl, { responseType: 'stream'});
          response.data.pipe(res);
      
})
  
let getVideoData = AsyncHandler(async(req,res)=>{
  let video_id = req.params.id;

  let videoModel = await postModel.findById(video_id).populate("author","username");
  if(!videoModel){
    return res.json({success:false, message : 'video not found'})
  }



  videoModel.views += 1;
  videoModel.save({validateBeforeSave : false})
  res.json({success:true, message : videoModel})
})

let deletePost = AsyncHandler(async(req,res)=>{
  let id = req.params.id;
  // let video_id = mongoose.Types.ObjectId(plain_id);
  // console.log(id)
  let isOwner = await postModel.findOne({ _id : id, author : req.user._id})
  if(!isOwner){
    return res.status(401).json({success:false , message : 'Invalid User'})
  }
  let deletePost = await postModel.findByIdAndDelete(isOwner._id);
  if(!deletePost){
    return res.json({success:false, message : 'Post not found'});
  }
  return res.json({success:true, message : 'Video deleted successfully'});
})

let getAuthorPost = AsyncHandler(async (req,res) => {
  let allPosts = await postModel.find({author : req.user._id}).populate('author','username');
  res.json({success:true, posts : allPosts});
})

export {VideoUpload,deleteFromCloudinary, getData, getAllPost,getVideoData, deletePost,getAuthorPost}