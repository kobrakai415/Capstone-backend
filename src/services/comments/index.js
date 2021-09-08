import express from 'express';
import PositionModel from '../../models/positions/schema.js'
import UserModel from '../../models/user/schema.js'
import PostModel from '../../models/posts/schema.js'
import CommentModel from '../../models/comments/schema.js'
import { JwtAuthenticateToken } from '../../auth/JWT.js'
import mongoose from 'mongoose';
import createError from "http-errors"



const { isValidObjectId } = mongoose

const router = express.Router()

router.post("/:postId", JwtAuthenticateToken, async (req, res, next) => {

    try {
        const newComment = new CommentModel({ ...req.body, post: req.params.postId })
        const comment = await newComment.save()

        if (comment) {
            const post = await PostModel.findByIdAndUpdate(req.params.postId,
                { $push: { comments: comment._id } },
                { new: true }
            ).populate("comments user").populate({ path: "comments", model: "Comment", populate: { path: "user", model: "User" } })

            post ? res.status(201).send(post) : next(createError(404, "Error saving comment to post!"))
        } else {
            next(createError(400, "Error creating new comment!"))
        }

    } catch (error) {
        next(error)

    }
})


router.delete("/:commentId", JwtAuthenticateToken, async (req, res, next) => {

    try {

        if (!isValidObjectId(req.params.commentId)) next(createError(404, "Comment Id is invalid!"))

        const comment = await CommentModel.findByIdAndDelete(req.params.commentId)
    
        if (comment) {
            const postToSend = await PostModel.findByIdAndUpdate(comment.post,
                { $pull: { comments: req.params.commentId } },
                { new: true }).populate("comments user").populate({ path: "comments", model: "Comment", populate: { path: "user", model: "User" } })
            postToSend ? res.status(200).send(postToSend) : next(createError(400, "Error deleting comment from post!"))
        } else {
           
            next(createError(400, "Error deleting comment!"))
        }

    } catch (error) {
        next(error)
    }
})


export default router