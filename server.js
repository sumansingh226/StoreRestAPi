import express from 'express';
import es6 from 'esm';
import url from 'url'
import { PORT, DB_URL } from './config/index.js';
import routes from './routes/index.js';
import errorHandler from './middlewere/errorHandler.js'
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// define express app 
const app = express();


// databse connection 
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.log.bind('conncetion error'));
db.once('open', () => {
    console.log('databse connected');
})

//use json
global.appRoot = path.resolve(__dirname);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//define routes
app.use('/api', routes);



//error handeler
app.use(errorHandler);
//listen to port
app.listen(PORT, () => {
    console.log(`server listening on http:localhost :${PORT}`);
})

