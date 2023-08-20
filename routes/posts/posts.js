import express from 'express';
import mongoose from 'mongoose';
import Post from '../../models/post/post.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import {v4} from 'uuid'
dotenv.config();

const jsonParser = bodyParser.json()

const router = express.Router()
    
// просмотр определенного поста
router.get('/post/getPost/:id', async (req, res) => {
    const {id} = req.params
    console.log(id);
    try {
        const post = await Post.findOne({postId: {$regex: new RegExp(`^${id}$`, 'i')}});
        console.log(post);
        await res.json(post)
    } catch (error) {
        res.status(404)
        res.json(`Такой идентификатор не найден попробуйте другой`)
    }
})

router.get('/post/getPosts/filter/:filterParams/:page', async (req, res) => {
    const {filterParams, page} = req.params
    let pageRes = page || 1
    try {
        const post = await Post.find({userId: {$regex: new RegExp(`^${filterParams}$`, 'i')}}).limit(pageRes * 10).sort({publishedDate: "desc"});
        console.log(post);
        await res.json(post)
    } catch (error) {
        res.status(404)
        res.json(`Такой идентификатор не найден попробуйте другой`)
    }
})

router.get('/post/getPosts/rec/:page', async (req, res) => {
    let { page } = req.params;
    const limit = 10
    const skip = page * limit;
    try {
        const post = await Post.find({ published: true}).skip(skip).limit(limit).sort({viewsCount: -1, publishedDate: -1});
        console.log(post);
        await res.json(post)
    } catch (error) {
        res.status(404)
        res.json(`Такой идентификатор не найден попробуйте другой`)
    }
})

// просмотр всех постов
router.get('/post/getPosts/:page', async (req, res) => {
    const {page} = req.params
    let pageRes = page || 1
    try {
        const posts = await Post.find({ published: true}).limit(pageRes * 10).sort({publishedDate: "desc"});

        await res.json(posts)
    } catch (error) {
        res.status(400)
        res.json(`Error`)
    }
})

// создание
router.post('/post/create', jsonParser, async (req, res) => {
    const {data} = req.body
    console.log(data);
    try {
        const article = new Post({
            title: data.title,
            description: data.description,
            username: data.username,
            userAvatar: data.userAvatar,
            postId: data.postId,
            data: data.data,
            stared: data.stared,
            tags: data.tags,
            images: [],
            hashtags: data.hashtags,
            likes: [],
            comments: [],
            viewsCount: 0,
        })
    
        await article.save()
        res.json({
            title: 'Пост создан',
            infoTitle: article
        })
    } catch (error) {
        res.status(400)
        res.json(`Error`)
    }
})

// удаление
router.get('/post/delete/:id', async (req, res) => {
    const {id} = req.params;
    console.log('detele', id);
    try {
        await Post.deleteOne({postId: {$regex: new RegExp(`^${id}$`, 'i')}})
            .then(function(){
                console.log("Post deleted"); // Success
            }).catch(function(error){
                console.log(error); // Failure
            });

        res.status(200)
        res.json({
            title: 'Пост удален'
        })
    } catch (error) {
        res.status(400)
        res.json(`Error`)
    }
})

// редактирование
router.post('/post/update/:id', async (req, res) => {
    const {data} = req.body
    console.log('work', data);
    try {
        const post = await Post.findOneAndUpdate({postId: data.postId}, {
            username: data.username,
            userAvatar: data.userAvatar,
            userId: data.userId,
            published: data.published,
            publishedDate: data.publishedDate,
            postId: data.postId,
            data: data.data,
            stared: data.stared,
            tags: data.tags,
            hashtags: data.hashtags,
            likes: data.likes,
            comments: data.comments,
            viewsCount: data.viewsCount,
          })
        if (!post) {
            const article = new Post({
                username: data.username,
                userAvatar: data.userAvatar,
                userId: data.userId,
                published: data.published,
                publishedDate: data.publishedDate,
                postId: data.postId,
                data: data.data,
                stared: data.stared,
                tags: data.tags,
                hashtags: data.hashtags,
                likes: [],
                comments: [],
                viewsCount: 0,
            })
            await article.save()
            console.log('create', article);
        }
        console.log('put', post);
        res.status(200)
        res.json({
            title: 'Пост обновлен'
        })
    } catch (error) {
        res.status(400)
        res.json(`Error`)
    }
})

export default router;