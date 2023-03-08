import express from 'express';
import mongoose from 'mongoose';
import Post from '../../models/post/post.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();

const jsonParser = bodyParser.json()

const router = express.Router()

// просмотр определенного поста
router.get('/post/getPost/:id', async (req, res) => {
    const {id} = req.params
    console.log(id);
    try {
        const post = await Post.findById(id).select('-__v')

        console.log(post);

        await res.json(post)
    } catch (error) {
        res.status(404)
        res.json(`Такой идентификатор не найден попробуйте другой`)
    }
})

// просмотр всех постов
router.get('/post/getPosts', async (req, res) => {
    try {
        const posts = await Post.find()

        await res.json(posts)
    } catch (error) {
        res.status(400)
        res.json(`Error`)
    }
})

// создание
router.post('/post/create', jsonParser, async (req, res) => {
    const {title, description, username, userAvatar} = req.body
    console.log(title, req.body);
    try {
        const article = new Post({
            title: title,
            description: description,
            username: username,
            userAvatar: userAvatar,
            tags: [],
            images: [],
            hashtags: [],
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
router.delete('/post/delete/:id', async (req, res) => {
    const {id} = req.params;
    try {
        await Post.deleteOne({_id: id})

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
router.put('/post/update/:id', async (req, res) => {
    const {id} = req.params;
    const {title = '', description = '', username = '', userAvatar = ''} = req.body
    console.log(title, req.body);
    try {
        const post = await Post.findByIdAndUpdate({_id: id}, {
            title: title,
            description: description,
            username: username,
            userAvatar: userAvatar,
            tags: [],
            images: [],
            hashtags: [],
            likes: [],
            comments: [],
            viewsCount: 0,
          })

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