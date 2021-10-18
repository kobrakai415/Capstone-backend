import express from "express"
import UserModel from "../../models/user/schema.js"
import createError from "http-errors"
import PostModel from '../../models/posts/schema.js'
import { LoginValidator } from "../../helpers/validators.js"
import { JwtAuthenticateUser, JwtAuthenticateToken, verifyAccessToken, refreshTokens } from "../../auth/JWT.js"
import { validationResult } from "express-validator"
import mongoose from 'mongoose'

const { isValidObjectId } = mongoose


const router = express.Router()


router.get("/", JwtAuthenticateToken, async (req, res, next) => {
    try {
        console.log(req.user.following)
        const userFeed = await PostModel.find({

            user: { $in: [req.user._id, ...req.user.following] }
        }).populate("user comments").populate({ path: "comments", model: "Comment", populate: { path: "user", model: "User" } })

        userFeed ? res.send(userFeed) : next(createError(404, "User feed empty"))

    } catch (error) {
        next(error)
    }
})

router.get("/:user/search", JwtAuthenticateToken, async (req, res, next) => {
    try {
        console.log(req.params.user)
        const regex = new RegExp(req.params.user, "i")
        console.log(regex)
        const users = req.params.user !== "suggested" ? await UserModel.find({ $and: [{ username: { $ne: req.user.username } }, { username: { $regex: regex } }] }, "name surname username") : await UserModel.find({ username: { $ne: req.user.username } }, "name surname username").limit(5)
        console.log(users)

        res.send(users);

    } catch (error) {
        console.log(error)
    }
})

router.post("/:userId/follow", JwtAuthenticateToken, async (req, res, next) => {
    try {

        if (!isValidObjectId(req.params.userId)) next(createError(404, "User Id is invalid!"))

        const userBeingFollowed = await UserModel.findByIdAndUpdate(req.params.userId,
            { $push: { followers: req.user._id } },
            { new: true }
        )

        if (userBeingFollowed) {
            const userFollowing = await UserModel.findByIdAndUpdate(req.user._id,
                { $push: { following: req.params.userId } },
                {
                    fields: { "following": 1, "followers": 1 },
                    new: true
                })

            console.log(userFollowing)
            userFollowing ?
                res.status(200).send(userFollowing)
                : next(creatError(400, "Error adding user to your following list!"))

        } else {
            next(createError(400, "Error updating user to be followed!"))
        }


    } catch (error) {
        next(error)
    }
})


router.post("/:userId/unfollow", JwtAuthenticateToken, async (req, res, next) => {
    try {

        if (!isValidObjectId(req.params.userId)) next(createError(404, "User Id is invalid!"))

        const userBeingUnFollowed = await UserModel.findByIdAndUpdate(req.params.userId,
            { $pull: { followers: req.user._id } },
            { new: true }
        )

        if (userBeingUnFollowed) {
            const userFollowing = await UserModel.findByIdAndUpdate(req.user._id,
                { $pull: { following: req.params.userId } },
                {
                    fields: { "following": 1, "followers": 1 },
                    new: true
                })
            console.log(userFollowing)

            userFollowing ?
                res.status(200).send(userFollowing)
                : next(creatError(400, "Error adding user to your following list!"))

        } else {
            next(createError(400, "Error updating user to be followed!"))
        }


    } catch (error) {
        next(error)
    }
})





export default router