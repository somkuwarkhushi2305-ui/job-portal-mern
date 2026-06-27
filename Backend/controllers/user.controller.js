import bcrypt from "bcrypt"; // we need to import bcrypt library to hash the password
import User from "../models/user.model.js";
import jwt from "jsonwebtoken"; // we need to import jwt library to generate token
import cloudinary from "../utils/cloud.js";
import getDataUri from "../utils/datauri.js";
export const register = async (req, res) => { //register ka controller function

    try {

        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const { fullname, email, password, role } = req.body;  //1. to register a user we need these fields from the frontend
        if (!fullname || !email || !password || !role) {  // if any of the fields are missing then we will return an error message
            return res.status(404).json({                                // if any of the fields are missing then we will return an error message
                message: "All fields are required",                     // this will be that error msg
                success: false,                                          //hence error is there so success will be false

            });

            const user = await User.findOne({ email }); //3. we will check if the user already exists in the database by using the email field (same email)      
            return res.status(400).json({           // if the user already exists then we will return an error message
                message: "User already exists",
                success: false,
            });
        }

        //convert passwords to hashes
        const hashedPassword = await bcrypt.hash(password, 10); //4. we will hash the password using bcrypt library with a salt round of 10 and for that we need bcrypt library so we will import that library at the top of this file

        const newUser = new User({      //5. we will create a new user using the User model and we will pass the fields that we got from the frontend and the hashed password
            fullname,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        return res.status(200).json({
            message: `Account created successfully ${fullname}`,
            success: true,
        });



    } catch (error) {
        console.log(error);
        return res.status(500).json({ // if there is any error then we will return an error message
            message: "Server Error, registration failed",
            success: false,
        });
    }
};
//toh ye tha humara register ka controller function (user signup k liye) ab hum login ka controller function likhenge jo ki user ko login karne ke liye use hoga aur usme bhi hum bcrypt library ka use karenge password ko compare karne ke liye    

export const login = async (req, res) => { //login ka controller function
    try {
        const { email, password, role } = req.body;          //1. to login a user we need these fields from the frontend
        if (!email || !password || !role) {                     // if any of the fields are missing then we will return an error message
            return res.status(404).json({             // if any of the fields are missing then we will return an error message
                message: "All fields are required",   // this will be that error msg
                success: false,                       //hence error is there so success will be false
            });
        }
        let user = await User.findOne({ email });     //2. we will check if the user exists in the database by using the email field (same email)
        if (!user) {
            return res.status(404).json({             // if the user does not exist then we will return an error message
                message: "Incorrect email  or password",   // this will be that error msg
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password); //3. we will compare the password that the user has entered with the hashed password that is stored in the database using bcrypt library
        if (!isPasswordMatch) {
            return res.status(404).json({
                message: "Incorrect email  or password",   // this will be that error msg
                success: false,
            })
        }

        //check role correct or not
        if (user.role !== role) {
            return res.status(403).json({
                message: "You don't have the necessary role to access this resource",
                success: false,
            });
        }

        // generate token 
        const tokendata = {
            userId: user._id,
        };
        console.log("SECRET =", process.env.JWT_SECRET);
        const token = jwt.sign(tokendata, process.env.JWT_SECRET, { expiresIn: "1d" }); //4. we will generate a token using jwt library and we will pass the userId as the payload and the secret key that we have defined in the .env file and we will set the token to expire in 7 days

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,

            role: user.role,
            profile: user.profile,
        };
        console.log("Logged-in User:", user);

        //set cookie  // ab hum token ko cookie me store krenge 
        return res
            .status(200)
            .cookie("token", token, {
                maxAge: 1 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "lax",
            })
            .json({
                message: `Welcome back ${user.fullname}`,
                user,
                success: true,
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ // if there is any error then we will return an error message
            message: "Server Error login failed",
            success: false,
        });
    }
};

export const logout = async (req, res) => { //logout ka controller function
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logout successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server Error logout",
            success: false,
        });
    }
};

export const updateProfile = async (req, res) => { //update profile ka controller function

    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body; //1. to update the profile of a user we need these fields from the frontend
        const file = req.file; //2. we will get the file from the request object that we have set in the multer middleware

        //cloudinary upload
        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }

        const userId = req.id; //2. we will get the userId from the request object that we have set in the auth middleware
        let user = await User.findById(userId); //3. we will find the user in the database by using the userId
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }
        //update database profile 
        if (fullname) {
            user.fullname = fullname;
        }
        if (email) {
            user.email = email;
        }
        if (phoneNumber) {
            user.profile.phoneNumber = phoneNumber;
        }

        if (bio) {
            user.profile.bio = bio;
        }

        if (skills) {
            user.profile.skills = skillsArray;

        }

        if (file) {
            const fileUri = getDataUri(file);

            const cloudResponse = await cloudinary.uploader.upload(
                fileUri.content,
                {
                    resource_type: "raw"
                }
            );
            console.log(cloudResponse);
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = file.originalname;
        }
        //resume 
        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,

            role: user.role,
            profile: user.profile,
        };

        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user

        });

    } catch (error) {
        console.log("UPDATE PROFILE ERROR:");
        console.log(error);

        return res.status(500).json({
            message: "Server Error update profile failed",
            success: false,
        });
    }
};


