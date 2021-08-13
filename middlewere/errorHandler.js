import esv from 'esm';
import Joi from 'joi';
const { ValidationError } = Joi;
import { DEBUG_MODE } from '../config/index.js';
import CustomerrorHandler from '../services/CustomErrorHandler.js';

const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let data =
    {
        message: 'Internal server error',
        ...(DEBUG_MODE === 'true' && { origenalError: err.message })
    }

    if (err instanceof ValidationError) {
        statusCode = 422;
        data:
        {
            message: err.message;
        }
    }
    
    if (err instanceof CustomerrorHandler) {
        statusCode = err.status;
        data:
        {
            message: err.message;
        }
    }


    return res.status(statusCode).json(data);

}

export default errorHandler;