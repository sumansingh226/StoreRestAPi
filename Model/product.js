import  mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {type:String, requireed : true},
    
    prize: {type:Number, requireed : true},
    
    size: {type:String, requireed : true},
    
    image: {type:String, requireed : true},
},{timestamps: true});

export default mongoose.model('Product',productSchema);
