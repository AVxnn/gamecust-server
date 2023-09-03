import express from 'express';
import mongoose from 'mongoose';
import posts from './routes/posts/posts.js';
import file from './routes/file/file.js';
import comments from './routes/comments/comments.js';
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

// Регулярное обновление "Поста дня" (каждый день в полночь)
const postDay = schedule.scheduleJob('30 * * * *', async function () {
    const posts = await Post.find({ published: true}).sort({viewsCount: -1});
    posts.map( async (post, index) => {
        if (post.viewsCount && index == 0) {
            console.log(await index);
            let data = await Post.findOneAndUpdate({postId: post.postId}, {
                username: post.username,
                userAvatar: post.userAvatar,
                userId: post.userId,
                published: post.published,
                publishedDate: post.publishedDate,
                postId: post.postId,
                data: post.data,
                stared: post.stared,
                tags: [{
                    type: 'postday',
                    text: 'Пост дня',
                    color: "#F05353",
                }], 
                hashtags: post.hashtags,
                likes: post.likes,
                comments: post.comments,
                viewsCount: post.viewsCount,    
            })
            console.log(data);
        } else {
            let data = await Post.findOneAndUpdate({postId: post.postId}, {
                username: post.username,
                userAvatar: post.userAvatar,
                userId: post.userId,
                published: post.published,
                publishedDate: post.publishedDate,
                postId: post.postId,
                data: post.data,
                tags: [],
                stared: post.stared,
                hashtags: post.hashtags,
                likes: post.likes,
                comments: post.comments,
                viewsCount: post.viewsCount,   
            })
            console.log(data);
        }
    })
    console.log('Задача выполнилась в ' + new Date());
});

const UrlDB = process.env.UrlDB
const PORT = process.env.PORT || 4000;

start(PORT, UrlDB)