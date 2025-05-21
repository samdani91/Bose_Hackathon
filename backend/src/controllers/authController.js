import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import setCookies from "../utils/setCookies.js";

export const signUp = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if(!name){
            return res.status(400).json({
                message: "Name is required."
            })
        }

        if(!email){
            return res.status(400).json({
                message: "Email is required."
            })
        };

        if(!password){
            return res.status(400).json({
                message: "Password is required."
            })
        };

        if(!confirmPassword){
            return res.status(400).json({
                message: "Confirm password is required."
            })
        };

        if(password !== confirmPassword){
            return res.status(400).json({
                message: "Passwords do not match."
            })
        };

        if(password.length < 6){
            return res.status(400).json({
                message: "Password must be at least 6 characters."
            })
        };

        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
            message: "Email must be a valid Gmail address."
            });
        };


        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "This email is associated with another account."
            })
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await new User({
            name,
            email,
            password: hashedPassword
        }).save();

        return res.status(201).json({
            message: "User created successfully.",
            user: {
                name: newUser.name,
                id: newUser._id,
                email: newUser.email
            }
        })


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error. Please try again."
        })
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email){
            return res.status(400).json({
                message: "Email is required."
            })
        };

        if (!password) {
            return res.status(400).json({
                message: "Password is required."
            })
        };

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "Invalid email or password."
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(404).json({
                message: "Invalid email or password."
            })
        }

        const accessTokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;
        const accessToken = jwt.sign({ userId: user._id, email: user.email, exp: accessTokenExp }, process.env.JWT_SECRET);

        setCookies(res, accessToken, accessTokenExp);

        res.status(200).json({
            user: {
                userId: user._id,
                email: user.email
            },
            message: "Login successful.",
            accessToken: accessToken,
            accessTokenExp: accessTokenExp,
            isAuthenticated: true,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error. Please try again."
        })
    }
};


export const getUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const existingUser = await User.findOne({ _id: user.userId });

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found."
            })
        }

        return res.status(200).json({
            user: {
                email: existingUser.email
            },
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error. Please try again."
        })
    }
}

export const changePassword = async (req, res) => {
    try {
        const userId = req.user_id;

        if (!userId) {
            return res.status(401).json({ message: "You are not authorized to change the password!" });
        }

        const { currentPassword, newPassword } = req.body;

        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found."
            })
        }

        const isMatch = await bcrypt.compare(currentPassword, existingUser.password);

        if (!isMatch) {
            return res.status(404).json({
                message: "Incorrect current password."
            })
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        return res.status(200).json({
            message: "Password changed successfully.",
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error. Please try again."
        })
    }
}