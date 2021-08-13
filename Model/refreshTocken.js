import mongoose from 'mongoose';
const Schema = mongoose.Schema;



//define a schema 

const refreshTockenSchema = new Schema({
    token: { type:String, unique: true}

}, { timestamps: false });

export default mongoose.model('RefreshToken', refreshTockenSchema);