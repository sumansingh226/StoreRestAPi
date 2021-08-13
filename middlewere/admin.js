import User from '../Model/user.js'
import CustomerrorHandler from '../services/CustomErrorHandler.js';
const admin = async(req,res,next)=>
{
    try {
        const user = await User.findOne({_id:req.body._id})
        if(user.role==='admin')
        {
            next();
        }
        else
        {
            return next (CustomerrorHandler.unAuthorized());
        }
    } catch (error) {
        return next (CustomerrorHandler.servererror());
    }
}

export default admin;