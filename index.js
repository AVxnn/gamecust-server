import express from 'express';
import mongoose from 'mongoose';
import posts from './routes/posts/posts.js';
import file from './routes/file/file.js';
import auth from './routes/auth/auth.js';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'
dotenv.config();

import error from './middleware/error/error.js'

const app = express();

const corsConfig = {
    origin: true,
    credentials: true,
};
  
app.use(cors(corsConfig));
app.options('*', cors(corsConfig))
app.use(express.json());
app.use(fileUpload({}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))

app.use('/images', express.static("static"))
app.use('', express.static("static"))

app.use('/api', auth)
app.use('/api', posts)
app.use('/api', file)

app.get('/', async (req, res) => {
    res.json({
        title: 'hello!'
    })
})

app.use(error)

async function start(PORT, UrlDB) {
    try {
        console.log('Если не запускается проект, то скорее всего не включен VPN')
        await mongoose.connect(UrlDB);
        app.listen(PORT, () => console.log('server start Port', PORT));
    } catch (e) {
        console.log(e)
    }
}

const UrlDB = process.env.UrlDB
const PORT = process.env.PORT || 4000;

start(PORT, UrlDB)