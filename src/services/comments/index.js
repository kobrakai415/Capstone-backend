import express from 'express';
import PositionModel from '../../models/positions/schema.js'
import UserModel from '../../models/user/schema.js'
import PostModel from '../../models/posts/schema.js'
import CommentModel from '../../models/comments/schema.js'
import { JwtAuthenticateToken } from '../../auth/JWT.js'
import mongoose from 'mongoose';
import createError from 'create-error';


const { isValidObjectId } = mongoose

const router = express.Router()

router.post("/:postId", JwtAuthenticateToken, async (req, res, next) => {

    try {
        if (!isValidObjectId(req.params.postId)) next(createError(404, `ID ${req.params.postId} is invalid`))
        const newComment = new CommentModel({ ...req.body, post: req.params.postId })
        const comment = await newComment.save()

        if (comment) {
            const post = await PostModel.findByIdAndUpdate(req.params.postId,
                { $push: { comments: comment._id } },
                { new: true }
            ).populate("comments")

            post ? res.status(201).send(post) : next(createError(404, "Error saving comment to post!"))
        } else {
            next(createError(400, "Error creating new comment!"))
        }

    } catch (error) {
        next(error)

    }
})



router.post("/", JwtAuthenticateToken, async (req, res, next) => {

    try {

        const newPost = new PostModel(req.body)
        const post = await newPost.save()

        if (post) {
            const postToSend = await PostModel.findById(post._id).populate("user  likes")
            postToSend ? res.status(201).send(postToSend) : next(createError(400, "Error creating post!"))
        } else {
            next(createError(400, "Error creating post!"))
        }

    } catch (error) {
        next(error)
    }
})


export default router