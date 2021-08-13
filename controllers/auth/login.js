import Joi from "joi";
import { User,RefreshToken } from "../../Model/index.js";
import { REFRESH_SECRET } from "../../config/index.js";
import CustomerrorHandler from '../../services/CustomErrorHandler.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import JwtService from "../../services/jwtservice.js";


const logincontroller = 
{
   async login (req,res,next)
   {
      const loginSchema =  Joi.object({
         email: Joi.string().email().required(),
         password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*]{6,16}$')).required(),
      });
      // validate the data coming from client side 
      const {error} = loginSchema.validate(req.body);
      
      if(error)
      {
         return next(error);
      }

      //cheke user exist in database or not
      try {
         const user = await User.findOne({email:req.body.email})
         {
            if(!user)
            {
               return next(CustomerrorHandler.wrondCridentiales());
            }

            // .body.body. compare the password 

            const match = await bcrypt.compare(req.body.password , user.password)
            if(!match)
            {
               return next(CustomerrorHandler.wrondCridentiales()); 
            }
//  genrate tocken 

       // Toekn
       const access_Token = JwtService.sign({ _id: user._id, role: user.role });
     
       const refresh_token = JwtService.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);
        // database whitelist
            await RefreshToken.create({ token: refresh_token });
            res.json({ access_Token, refresh_token });
           

       
         }
      } catch (err) {
          return next(err); 
      }
   },
//logout the user
async logout(req, res, next) {
   // validation
   const refreshSchema = Joi.object({
       refresh_token: Joi.string().required(),
   });
   const { error } = refreshSchema.validate(req.body);

   if (error) {
       return next(error);
   }

   try {
       await RefreshToken.deleteOne({ token: req.body.refresh_token });
   } catch(err) {
       return next(new Error('Something went wrong in the database'));
   }
   res.json({ status: 1 });
}
}

export default logincontroller;