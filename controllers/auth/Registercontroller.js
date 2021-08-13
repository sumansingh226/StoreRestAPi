import Joi from "joi";
import { REFRESH_SECRET } from "../../config/index.js";
import {
    RefreshToken,
    User
} from "../../Model/index.js";
import bcrypt from 'bcrypt';
import CustomerrorHandler from '../../services/CustomErrorHandler.js';
import jwtService from "../../services/jwtservice.js";

const registercontroller = {

    //validate user 
    async register(req, res, next) {
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(10).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*]{6,16}$')).required(),
            repeat_password: Joi.ref('password')
        });

        //define if eror
        const {
            error
        } = registerSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        //check if user already in database;
        try {
            const exist = await User.exists({
                email: req.body.email
            });
            if (exist) {
                return next(CustomerrorHandler.alreadyExist('This email is already tacken'));
            }
        } catch (err) {
            return next(err)
        }


        //prepare the model like how our document inside database
        const {
            name,
            email,
            password
        } = req.body;

        //hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        //save req.body data to database
        let access_Tocken;
        let refresh_Tocken;
        try {

            const result = await user.save();
            // tocken 
            access_Tocken = jwtService.sign({
                _id: result._id,
                role: result.role
            });
            refresh_Tocken = jwtService.sign({
                _id: result._id,
                role: result.role
                
            },'1y' ,REFRESH_SECRET);

            // databas whitelist 
       await RefreshToken.create({token:refresh_Tocken})

        } catch (err) {
            return next(err);
        }

        res.json({
            access_Tocken:access_Tocken,
            refresh_Tocken:refresh_Tocken
        });
    }
}

export default registercontroller;