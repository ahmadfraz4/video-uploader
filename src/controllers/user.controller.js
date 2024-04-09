import { userModel } from "../models/user.model.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import bcrypt from 'bcryptjs';
let registerUser = AsyncHandler(async(req,res)=>{
    let {username, email, password} = req.body;
    let isExist =await userModel.findOne({$or : [{username:username}, {email:email}] });
    if(isExist){
        return res.json({success : false, message :'User Already Exist'});
    }
    let options = {
        httpOnly : true, secure : true, expiresIn : 60 * 60 * 60 * 24 * 30 // now cookies can't be modified from frontend
    };
    let createUser =await userModel.create({username:username, email:email, password:password});

    let excludePassword = createUser.toJSON();
    delete excludePassword.password;

    let generateToken = await createUser.generateToken();
    res.cookie('token', generateToken,options).json({success : true, message:excludePassword})
})

let isUsernameExist = AsyncHandler(async(req,res)=>{
    let {username} = req.body;
    let isUsernameExist = await userModel.findOne({username:username});
    if(isUsernameExist){
        return res.json({success:false, message:'username already taken'})
    }
    res.json({success:true, message : 'username available'})
})

let getCurrentUser = AsyncHandler(async (req,res) =>{
    let id = req.user._id;
    let user =await userModel.findById(id).select('-password');
    res.json({success:true, user})
})

let loginUser = AsyncHandler(async(req,res)=>{
    let {email, password} = req.body;
    let user = await userModel.findOne({ email: email }).select('+password')
    if(!user){
        return res.json({success : false, message :'User not Exist'});
    }
    let isPasswordCorrect =await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
        return res.json({success : false, message :'Invalid Email or Password'});
    }
    let options = {
        httpOnly : true, secure : true, expiresIn : 60 * 60 * 60 * 24 * 30 // now cookies can't be modified from frontend
    };
    // await user.select('-password')
    let generateToken = await user.generateToken();
    let responseData = user.toJSON(); 
    delete responseData.password;
    res.cookie('token', generateToken,options).json({success : true, message:responseData })
})

let logout = AsyncHandler (async (req,res) => {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logout successful' });
})


export {isUsernameExist, registerUser, loginUser,getCurrentUser,logout}