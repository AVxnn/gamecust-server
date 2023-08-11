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

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));
app.use(express.json());
app.use(fileUpload({}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))

app.use(express.static(process.env.STATIC_PATH))


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
        console.log('Если не запускается проект, то скорее всего не включен VPN' + UrlDB)
        await mongoose.connect(UrlDB);
        app.listen(PORT, () => console.log('server start Port', PORT));
    } catch (e) {
        console.log(e)
    }
}

const UrlDB = process.env.UrlDB
const PORT = process.env.PORT || 4000;

start(PORT, UrlDB)