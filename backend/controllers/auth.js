import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import user from "../models/user.js"

//register user
export const Register = async (req, res) => {

    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const existingUser = await user.findOne({
            email: email
        });
        if (existingUser) {
            res.json({
                message: "This email already exists",
                existingUser
            })
        }
        else {
            const newUser = new user({
                firstName,
                lastName,
                email,
                password: passwordHash,
                picturePath,
                friends,
                location,
                occupation,
                viewedProfile: Math.floor(Math.random() * 10000),
                impressions: Math.floor(Math.random() * 1000)
            })
            const savedUser = await newUser.save();
            res.status(201).json(savedUser);
        }
    } catch (error) {
        res.status(403).json({
            error: error.message
        })
    }
};



//login user 
export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find the user by email
      const existingUser = await user.findOne({ email: email });
      if (!existingUser) {
        return res.status(400).json({ msg: "User doesn't exist." });
      }
  
      // Check if the password matches
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials." });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      existingUser.password = undefined; // Ensure the password is not included in the response
  
      // Return the token and user data
      res.status(200).json({ token, existingUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };