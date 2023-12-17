import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        next(err);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const valideUser = await User.findOne({ email });
        if (!valideUser) {
            return next(errorHandler(404, "User not found"));
        }
        const validPassword = bcryptjs.compareSync(password, valideUser.password);
        if (!validPassword) {
            return next(errorHandler(401, "Wrong credentials!"));
        }
        const token = jwt.sign({ id: valideUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const { password: pass, ...rest } = valideUser._doc;
        res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest);
        res.status(200).json(valideUser);
    } catch (err) {
        next(err);
    }
};