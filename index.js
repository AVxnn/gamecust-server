import express from 'express';
import mongoose from 'mongoose';
import posts from './routes/posts/posts.js';
import file from './routes/file/file.js';
import comments from './routes/comments/comments.js';
import level from './routes/level/level.js';
import auth from './routes/auth/auth.js';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import schedule from "node-schedule";
import Post from './models/post/post.js';
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

app.use('', express.static("static"))
app.use('', express.static("avatars"))

app.use('/api', auth)
app.use('/api', posts)
app.use('/api', file) 
app.use('/api', comments)
app.use('/api', level)
app.use(error)

app.get('/', async (req, res) => {
    res.json({
        title: 'hello!'
    })
})

async function start(PORT, UrlDB) {
    try {
        console.log('Если не запускается проект, то скорее всего не включен VPN')
        await mongoose.connect(UrlDB);
        app.listen(PORT, () => console.log('server start Port', PORT));
    } catch (e) {
        console.log(e)
    }
}

const w = schedule.scheduleJob('30 * * * *', async function () {
    let today = new Date().setHours(0, 0, 0, 0);
    let posts = await Post.find({ published: true}).sort({viewsCount: -1});
    let result = posts.filter(item => item.publishedDate >= today)[0]
    posts.map(async (post, index) => {
        let data = await Post.findOneAndUpdate({postId: post.postId}, {
            tags: [], 
        })
    })
    let data = await Post.findOneAndUpdate({postId: result.postId}, {
        tags: [{
            type: 'postday',
            text: 'Пост дня',
            color: "#F05353",
        }],  
    })
    console.log(data)
    console.log('Задача выполнилась в ' + new Date());
});

const UrlDB = process.env.UrlDB
const PORT = process.env.PORT || 4000;

start(PORT, UrlDB)