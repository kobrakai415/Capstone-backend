import express from 'express';
import PositionModel from '../../models/positions/schema.js'
import UserModel from '../../models/user/schema.js'
import PostModel from '../../models/posts/schema.js'
import { JwtAuthenticateToken } from '../../auth/JWT.js'
import mongoose from 'mongoose';
import createError from 'create-error';


const { isValidObjectId } = mongoose

const router = express.Router()

router.get("/:ticker", JwtAuthenticateToken, async (req, res, next) => {

    try {
        const posts = await PostModel.find({ ticker: req.params.ticker }).populate("User comments likes")

        if (posts.length > 0) {
            res.send(posts)
        } else {
            next(createError(404, "No posts for this ticker were found!"))
        }
    } catch (error) {
        next(error)

    }
})

router.post("/:ticker", JwtAuthenticateToken, async (req, res, next) => {

    try {
        const newPost = new PostModel(req.body)
        const post = await newPost.save()

        if (post) {
            const postToSend = await PostModel.findById(post._id).populate("User Comments Likes")
            postToSend ? res.status(201).send(postToSend) : next(createError(400, "Error creating post!"))
        } else {
            next(createError(400, "Error creating post!"))
        }

    } catch (error) {
        next(error)
    }
})





export default router