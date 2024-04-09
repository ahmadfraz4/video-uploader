import mongoose, { Mongoose } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
let userSchema = new mongoose.Schema({
    username : {
        type : String, required : true
    },
    email : {
        type : String, required : true
    },
    password : {
        type : String, required : true
    }
})

userSchema.pre('save',async function (next){
    if(this.isModified('password')){
        this.password =await bcrypt.hash(this.password, 10);
    }
    next();
})

userSchema.methods.generateToken =async function (){
    let token = await jwt.sign({_id : this._id}, process.env.JWT_KEY);
    return token
}

let userModel = new mongoose.model('User', userSchema);
export {userModel}