import Product from "../Model/product.js";
import multer from "multer";
import path from 'path';
import productSchema from "../validator/productValidator.js";
import {
    fileURLToPath
} from 'url';
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
import Joi from "joi";
import fs from 'fs';
import CustomerrorHandler from "../services/CustomErrorHandler.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;
        // 3746674586-836534453.png
        cb(null, uniqueName);
    },
});




const handlemultiPartData = multer({
    storage,
    limits: {
        fileSize: 50000 * 5
    }
}).single('image');

console.log(handlemultiPartData);
const productController = {
    async store(req, res, next) {
        // multiple from data 

        handlemultiPartData(req, res, async (err) => {
            if (err) {
                return next(CustomerrorHandler.servererror(err.message));
            }

            console.log(req.file);
            const filepath = req.file.path;

           
            const {
                error
            } = productSchema.validate(req.body);


            if (error) {
                //detet the upload file
                fs.unlink(`${appRoot}/${filepath}`, (err) => {
                   if(err)
                   {
                    return next(CustomerrorHandler.servererror(err.message));
                   }
                });

                return next(error);
            }

            const {
                name,
                prize,
                size
            } = req.body;
            let document;
            try {
                document = await Product.create({
                    name,
                    prize,
                    size,
                    image: filepath,
                });
            } catch (err) {
                return next(err);
            }


            res.status(201).json(document);
        });
    },

    update(req, res, next) {
        handlemultiPartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }
            let filePath;
            if (req.file) {
                filePath = req.file.path;
            }

            // validation
            const { error } = productSchema.validate(req.body);
            if (error) {
                // Delete the uploaded file
                if (req.file) {
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if (err) {
                            return next(
                                CustomErrorHandler.serverError(err.message)
                            );
                        }
                    });
                }

                return next(error);
                // rootfolder/uploads/filename.png
            }

            const { name, prize, size } = req.body;
            let document;
            try {
                document = await Product.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        name,
                        prize,
                        size,
                        ...(req.file && { image: filePath }),
                    },
                    { new: true }
                );
            } catch (err) {
                return next(err);
            }
            res.status(201).json(document);
        });
    },


    // --------------delete a product

    async destroy (req,res,next)
    {
        const document = await Product.findOneAndRemove({_id:req.params.id});

        if(!document)
        {
            return next(new Error('Nothing to delete'));
        }

        // image delete
        const imagePath = document._doc.image;
        fs.unlink(`${appRoot}/${imagePath}`,(err)=>
        {
            if(err)
            {
                return next(CustomerrorHandler.servererror());
            }
           
        });

        res.json(document);
    },
    async index(req, res, next) {
        let documents;
        // pagination mongoose-pagination
        try {

            documents = await Product.find().select('-_id -size -image -createdAt -updatedAt -__v').sort({_id:-1});
        
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
    },

    async show(req, res, next) {
        let document;
        try {
            document = await Product.findOne({ _id: req.params.id }).select(
                '-_id -size -image -createdAt -updatedAt -__v'
            );
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(document);
    },

}

export default productController;