import Joi from 'joi';
import es6 from 'esm';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;



//define a schema 

const userSchema = new Schema({
    name: { type: String, required: true, },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, },
    role: { type: String, default: 'customer' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);