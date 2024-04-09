import mongoose from "mongoose";

export let Connection = async () => {
  try {
    let connectInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
    console.log('connected to mongodb !!')
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

