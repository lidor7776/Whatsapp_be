import createHttpError from "http-errors";
import validator from "validator";
import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
//env variables
const {DEFAULT_PICTURE,DEFAULT_STATUS}=process.env

export const createUser = async (userData) => {
  const { name, email, picture, status, password } = userData;

  //check if fields are empty
  if (!name || !email || !password) {
    throw createHttpError.BadRequest("Please fill all fields");
  }

  //check name length
  if (
    !validator.isLength(name, {
      min: 2,
      max: 21,
    })
  ) {
    throw createHttpError.BadRequest(
      "Please make sure your name is between 2 to 16 characters"
    );
  }

  //check status length
  if (status && status.lenght > 64) {
    throw createHttpError.BadRequest(
      "Please make sure your status is less than 64 characters"
    );
  }

  //check if email is valid
  if (!validator.isEmail(email)) {
    throw createHttpError.BadRequest("Please make sure your email is valid");
  }

  //check if email is already exist
  const checkDB = await UserModel.findOne({ email });
  if (checkDB) {
    throw createHttpError.Conflict(
      "Please try again with diffrent email address,this email already exist"
    );
  }

  //check password length
  if (
    !validator.isLength(password, {
      min: 6,
      max: 128,
    })
  ) {
    throw createHttpError.BadRequest(
      "Please make sure your password is between 6 to 128 characters"
    );
  }

///hash password--->to be done in the user model




//adding user to database
  const user = await new UserModel({
    name,
    email,
    picture: picture||DEFAULT_PICTURE,
    status:status||DEFAULT_STATUS,
    password,
  }).save();

  return user;
};


export const signUser=async(email,password)=>{
     const user =await UserModel.findOne({email:email.toLowerCase()}).lean();
     //check if email exist
     if(!user){
      throw createHttpError.NotFound('Invalid credentials.')
     }

     let passwordMatches=await bcrypt.compare(password,user.password);
     if (!passwordMatches) throw createHttpError.NotFound('Invalid credentials.')


    };

