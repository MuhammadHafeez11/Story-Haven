const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


async function handleLoginUser(req, res, next) {
    const { username, password } = req.body;

    if (!username || !password) {
        const error = new Error("Username and password are required.");
        error.statusCode = 400;
        return next(error);
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            const error = new Error('Invalid credentials. Please try again.');
            error.statusCode = 400;
            return next(error);
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign(
                { id: user._id, isAdmin: user.isAdmin },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            return res.status(200).json({ message: 'Login successful', user, token });
        } else {
            const error = new Error('Invalid credentials. Please try again.');
            error.statusCode = 400;
            return next(error);
        }
    } catch (err) {
        return next(err);
    }
}

async function handleLogOut(req, res, next) {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });
        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        return next(error);
    }
}

async function handleSignUpUser(req, res, next) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        const error = new Error('All fields are required and should not be empty.');
        error.statusCode = 400;
        return next(error);
    }

    try {
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            const error = new Error('Username already exists.');
            error.statusCode = 400;
            return next(error);
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            const error = new Error('Email already exists.');
            error.statusCode = 400;
            return next(error);
        }

        const data = new User(req.body);
        const user = await data.save();
        return res.status(200).json({ message: 'Signup successful', user });
    } catch (error) {
        return next(error);
    }
}

async function handleGetUserById(req, res, next) {
    try {
        const data = await User.findById(req.params.id).populate("role");
        // console.log(data);
        
        return res.status(200).json({ status: "Success", data });
    } catch (error) {
        return next(error);
    }
}

async function handleGetAllUser(req, res, next) {
    try {
        const data = await User.find();
        return res.json(data);
    } catch (error) {
        return next(error);
    }
}

async function handleVerifyUserCredentials(req, res, next) {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ status: "Error", message: "User not found" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ status: "Error", message: "Incorrect password" });
      }
  
      return res.json({ status: "Success", message: "User verified" });
    } catch (error) {
      return next(error);
    }
  }

  async function handleUpdateUserById(req, res, next) {
    try {
      const id = req.params.id;
      let { username, email, password, currentPassword } = req.body; 
  
      const user = await User.findById({ _id: id });
      if (!user) {
        return res.status(404).json({ status: "Error", message: "User not found" });
      }
  
      if (password) {
        // Hash the new password
        password = await bcrypt.hash(password, 12);
      }
  
      // Update the user with the new data
      const updatedUser = await User.findByIdAndUpdate(
        { _id: id },
        { $set: { username, email, password } },
        { new: true } // Return the updated user object
      );
  
    //   console.log(updatedUser);
  
      return res.json({ status: "Success", data: updatedUser });
    } catch (error) {
      return next(error);
    }
  }
  
  
async function handleDeleteUserById(req, res, next) {
    try {
        const data = await User.findByIdAndDelete(req.params.id);
        return res.json({ status: "Success", data });
    } catch (error) {
        return next(error);
    }
}

async function handlePromoteUserToAdmin(req, res, next) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            return next(error);
        }
        user.isAdmin = true;
        await user.save();
        return res.json({ message: 'User promoted to admin', user });
    } catch (error) {
        return next(error);
    }
}

async function handleDemoteUserToAdmin(req, res, next) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            return next(error);
        }
        user.isAdmin = false;
        await user.save();
        return res.json({ message: 'User demoted from admin', user });
    } catch (error) {
        return next(error);
    }
}

// New controller to fetch total number of users
async function handleGetTotalUsersCount(req, res, next) {
    try {
      const totalUsersCount = await User.countDocuments();
      res.status(200).json({ totalUsersCount });
    } catch (err) {
      next(err);
    }
  }   
  
module.exports = {
    handleLoginUser,
    handleSignUpUser,
    handleGetUserById,
    handleUpdateUserById,
    handleDeleteUserById,
    handleDemoteUserToAdmin,
    handlePromoteUserToAdmin,
    handleGetAllUser,
    handleLogOut,
    handleGetTotalUsersCount,
    handleVerifyUserCredentials,
};