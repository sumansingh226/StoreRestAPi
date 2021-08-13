import express from 'express';
const router = express.Router();
import {registercontroller,logincontroller,userController,refreshController,productController} from '../controllers/index.js'
import auth from '../middlewere/auth.js'
import admin from '../middlewere/admin.js'
//create a new user
router.post('/register',registercontroller.register);
router.post('/login',logincontroller.login);
router.get('/me',auth,userController.me);  
router.post('/refresh',refreshController.refresh); 
// for refresh tocken

// you can use 'auth and admin'(*   Optional task   *) as a middlewre for authetication'
router.post('/logout',logincontroller.logout);

//for products
router.post('/Product',productController.store);//create a product
router.put('/Product/:id',productController.update);//update a product
router.delete('/Product/:id',productController.destroy);//delete a product
router.get('/Product',productController.index);//find all product
router.get('/Product/:id',productController.show);//fina a single product by id

export default router;