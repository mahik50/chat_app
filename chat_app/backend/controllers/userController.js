import {User} from "../models/userModel.js";
import {v4 as uuidv4} from "uuid";

export const userRegister = async (req, res) => {
    const {email, username, password} = req.body;

    if(!email || !username || !password) {
        return res.status(302).json({
            message: "all fields required",
        })
    }

    const existingUser = await User.findOne({email})
    if(existingUser) {
        return res.status(302).json({
            message: "user already exists"
        })
    }

    const user = await User.create({
        email,
        username,
        password
    })

    const createdUser = await User.findById(user._id).select("-password");

    if(!createdUser) {
        return res.status(302).json({
            message: "error in creating user"
        })
    }
    
    console.log(createdUser);

    res.status(200).json({
        message: "user created successfully",
        createdUser
    })
};

export const userLogin = async (req, res) => {
    const {username, password} = req.body;

    if(!username || !password) {
        return res.status(302).json({
            message: "all fields required"
        }) 
    }

    const user = await User.findOne({username});
    if(!user) {
        return res.status(302).json({
            message: "user does not exists"
        })
    }

    const isValidPassword = await user.isPasswordCorrect(password);
    if(!isValidPassword) {
        return res.status(302).json({
            message: "invalid password"
        }) 
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});

    const loggedInUser = await User.findOne({username}).select("-password");

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
        message: "user logged in successfully",
        loggedInUser,
        accessToken
    })
}

export const userLogout = async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
        message: "user logged out successfully"
    })
}


const roomMap = new Map();
export const createRoom = async (req, res) => {
    const {username} = req.body; // array of strings in map

    const roomID = uuidv4(); // key in map
    if(!roomMap.has(roomID)) {
        roomMap.set(roomID, []);
    }  
    roomMap.get(roomID).push(username);

    const roomUsers = roomMap.get(roomID);
    res.status(200).json({  
        message: "room created successfully",
        roomID: roomID,
        roomUsers: roomUsers
    })
}

export const joinRoom = async (req, res) => {
    const {username, roomID} = req.body;

    if(!roomMap.has(roomID)) {
        return res.status(404).json({
            message: "Invalid room ID"
        })
    }
    roomMap.get(roomID).push(username)

    const roomUsers = roomMap.get(roomID);

    res.status(200).json({
        message: "user joined the room successfully",
        roomID: roomID,
        roomUsers: roomUsers
    })
}