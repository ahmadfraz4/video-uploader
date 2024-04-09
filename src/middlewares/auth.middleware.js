import { userModel } from "../models/user.model.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
// import dotenv from "dotenv";
import jwt from 'jsonwebtoken';

let auth = AsyncHandler(async(req,res,next)=>{
    let {token} = req.cookies;
   
    if(!token){
        // throw new Error('Login to access');
        return res.status(401).json({success:false, message : 'Login to access'})
    }
    let decodeData = jwt.verify(token, process.env.JWT_KEY)
    
    let user = await userModel.findById(decodeData._id)
    if(!user){
        throw new Error('Invalid User'); 
    }
    req.user = user
    req.token = token
    next()
})

export {auth}