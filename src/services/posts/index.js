import express from 'express';
import PositionModel from '../../models/positions/schema.js'
import UserModel from '../../models/user/schema.js'
import PostModel from '../../models/posts/schema.js'
import { JwtAuthenticateToken } from '../../auth/JWT.js'
import mongoose from 'mongoose';
import createError from "http-errors"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import multer from "multer"

const { isValidObjectId } = mongoose

const router = express.Router()


router.get("/", JwtAuthenticateToken, async (req, res, next) => {
    try {
        const posts = await PostModel.find({
            user: req.user._id
        }).populate({ path: "comments", model: "Comment", populate: { path: "user", model: "User" } })

        posts.length > 0 ? res.send(posts) : next(createError(404, "No posts for user!"))

    } catch (error) {
        next(error)
    }

})

router.get("/:ticker", JwtAuthenticateToken, async (req, res, next) => {

    try {
        const posts = await PostModel.find({ ticker: req.params.ticker }).populate("user comments").populate({ path: "comments", model: "Comment", populate: { path: "user", model: "User" } })

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
            const postToSend = await PostModel.findById(post._id).populate("user comments").populate({ path: "comments", model: "Comment", populate: { path: "user", model: "User" } })
            postToSend ? res.status(201).send(postToSend) : next(createError(400, "Error creating post!"))
        } else {
            next(createError(400, "Error creating post!"))
        }

    } catch (error) {
        next(error)
    }
})

router.post("/:postId/like", JwtAuthenticateToken, async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.postId)) next(createError(404, "Id is invalid!"))

        const like = await PostModel.find({ _id: req.params.postId, likes: req.user._id })

        if (like.length > 0) {
            const unlike = await PostModel.findByIdAndUpdate(req.params.postId,
                { $pull: { likes: req.user._id } },
                { new: true }).populate("user comments").populate({ path: "comments", model: "Comment", populate: { path: "user", model: "User" } })

            unlike ? res.status(200).send(unlike) : next(createError(400, "Error unliking post!"))
        } else {
            const like = await PostModel.findByIdAndUpdate(req.params.postId,
                { $push: { likes: req.user._id } },
                { new: true }).populate("user comments").populate({ path: "comments", model: "Comment", populate: { path: "user", model: "User" } })

            like ? res.status(200).send(like) : next(createError(400, "Error liking post!"))

        }

    } catch (error) {
        next(error)
    }
})

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "postcovers",
        resource_type: "auto"
    }
})

const upload = multer({
    storage: cloudinaryStorage,

}).single("postcover")

router.post("/:id/uploadCover", JwtAuthenticateToken, upload, async (req, res, next) => {

    try {

        if (!isValidObjectId(req.params.id)) next(createError(404, "Id is invalid!"))
        const post = await PostModel.findByIdAndUpdate(req.params.id,
            { image: req.file.path },
            { new: true })


        if (post) {
            const posts = await PostModel.find({ stock: post.stock }).populate("user likes")

            posts.length > 0 ? res.status(200).send(posts) : next(createError(400, "Error retrieving posts "))
        } else {
            next(createError(400, "Error saving image!"))
        }
    } catch (error) {
        next(error)
    }
})





export default router