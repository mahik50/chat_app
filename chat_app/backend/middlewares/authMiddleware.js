import { User } from "../models/userModel.js" 
import jwt from "jsonwebtoken"

export const verifyJWT = async (req, res, next) => {
    const token = req.cookies?.accessToken ||  req.header("Authorization")?.replace("Bearer ","");

    if(!token){
        res.status(400).json({
            message: "unauthorised request"
        })
        return
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if(!user){
        res.status(400).json({
            message: "invalid access token"
        })
        return
    }

    req.user = user;
    next()

}