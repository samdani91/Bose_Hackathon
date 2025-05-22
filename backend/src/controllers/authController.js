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
        console.log("login error",err);
        return res.status(500).json({
            message: "Internal server error. Please try again."
        })
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            path: '/',
        });

        res.clearCookie("isAuthenticated", {
            httpOnly: false,
            secure: true,
            sameSite: 'None',
            path: '/',
        });

        res.status(200).json({ message: "Sign out successful" });
    } catch (err) {
        console.error('Logout error:', err);
        res.status(500).json({ message: "Internal server error during logout" });
    }
};

export const getUser = async (req, res) => {
    try {
        const userId = req.user_id;

        if (!userId) {
            return res.status(401).json({ message: "You are not authorized to get user data" });
        }

        const { id } = req.params;

        const existingUser = await User.findById(id);

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found."
            })
        }

        return res.status(200).json({
            user: {
                email: existingUser.email,
                name: existingUser.name,
                id: existingUser._id,
                createdAt: existingUser.createdAt,
                image: existingUser.image,
                bio:existingUser.bio,
                occupation:existingUser.occupation,
                institution:existingUser.institution,
                classs:existingUser.classs,
            },
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error. Please try again."
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const userId = req.user_id;

        if (!userId) {
            return res.status(401).json({ message: "You are not authorized to update this profile!" });
        }

        const { name, email, occupation, bio, image, institution, classs } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Name is required."
            });
        }

        if (!email || !email.trim()) {
            return res.status(400).json({
                message: "Email is required."
            });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Email must be a valid Gmail address."
            });
        }

        // Check if email is already in use by another user
        const existingUserWithEmail = await User.findOne({ email, _id: { $ne: userId } });
        if (existingUserWithEmail) {
            return res.status(400).json({
                message: "This email is associated with another account."
            });
        }

        const updateData = {
            name: name.trim(),
            email: email.trim(),
            occupation: occupation ? occupation.trim() : '',
            institution: institution ? institution.trim() : '',
            classs:classs ? classs.trim() : '',
            bio: bio ? bio.trim() : '',
            image: image || ''
        };

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: {
                email: updatedUser.email,
                name: updatedUser.name,
                id: updatedUser._id,
                createdAt: updatedUser.createdAt,
                image: updatedUser.image,
                bio: updatedUser.bio,
                occupation: updatedUser.occupation,
            },
        });
    } catch (err) {
        console.error('Update user error:', err);
        return res.status(500).json({
            message: "Internal server error. Please try again."
        });
    }
};

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

export const resetForgotPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found."
            })
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.findByIdAndUpdate(existingUser._id, { password: hashedPassword });

        return res.status(200).json({
            message: "Password reset successfully.",
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error. Please try again."
        })
    }
}

export const getUserId = async (req, res) => {
    try {
        const userId = req.user_id;

        if (!userId) {
            return res.status(401).json({ message: "You are not authorized. No user ID found." });
        }

        return res.status(200).json({
            user_id: userId,
            message: "User ID retrieved successfully."
        });
    } catch (err) {
        console.log(`Error in getUserId: ${err}`);
        return res.status(500).json({ message: "Internal server error. Please try again." });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'name _id image occupation').sort({ createdAt: -1 });
        res.status(200).json({ message: "Users fetched successfully.", users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error while fetching users." });
    }
};