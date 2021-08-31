import createError from 'create-error';
import express from 'express';
import WatchlistModel from '../../models/watchlists/schema.js';
import UserModel from '../../models/user/schema.js';
import { JwtAuthenticateToken } from '../../auth/JWT.js';
import mongoose from 'mongoose';

const { isValidObjectId } = mongoose

const router = express.Router()

router.get("/watchlists", JwtAuthenticateToken, async (req, res, next) => {
    try {
        const watchlists = await WatchlistModel.find()

        if (watchlists.length > 0) {
            res.send(watchlists)
        } else {
            next(createError(404, "No watchlists!"))
        }
    } catch (error) {
        next(error)
    }
})

router.post("/new", JwtAuthenticateToken, async (req, res, next) => {
    try {
        const newWatchlist = new WatchlistModel(req.body)
        const savedWatchlist = await newWatchlist.save()
        console.log(savedWatchlist)
        if (savedWatchlist) {
            const user = await UserModel.findByIdAndUpdate(req.user._id,
                {
                    $push: { watchlists: savedWatchlist._id }
                }, { new: true }).populate("portfolio watchlists")

            user ? res.status(201).send(user) : next(createError(400, "Error creating watchlist!"))
        } else {
            next(createError(400, "Failed to create watchlist"))
        }

    } catch (error) {
        next(error)
    }
})

router.post("/:id/add", JwtAuthenticateToken, async (req, res, next) => {
    try {

        if (!isValidObjectId(req.params.id)) next(createError(404, `ID ${req.params.id} is invalid`))

        const watchlist = await WatchlistModel.findByIdAndUpdate(req.params.id, {
            $push: { stocks: req.body }
        })

        if (watchlist) {
            const user = await UserModel.findById(req.user._id).populate("portfolio watchlists")
            user ? res.status(200).send(user) : next(createError(400, "Error adding to watchlist!"))
        } else {
            next(createError(400, "Error adding to watchlist!"))
        }
    } catch (error) {
        next(error)
    }
})

router.post("/:id/remove/:stockId", JwtAuthenticateToken, async (req, res, next) => {
    try {

        if (!isValidObjectId(req.params.id)) next(createError(404, `ID ${req.params.id} is invalid`))

        const watchlist = await WatchlistModel.findByIdAndUpdate(req.params.id, {
            $pull: { stocks: { _id: req.params.stockId } }
        }, { new: true })

        if (watchlist) {
            const user = await UserModel.findById(req.user._id).populate("portfolio watchlists")
            res.status(200).send(user)
        } else {
            next(createError(400, "Error removing from watchlist!"))
        }

    } catch (error) {
        next(error)
    }
})




router.put("/watchlists", JwtAuthenticateToken, async (req, res, next) => {
    try {
        const watchlist = await WatchlistModel.findById(req.body.id)

        if (watchlist) {
            const updatedWatchlist = await WatchlistModel.findByIdAndUpdate(req.body.id)

        } else {
            next(createError(404, "Watchlist not found!"))
        }
    } catch (error) {
        next(error)
    }
})
router.delete("/watchlists", JwtAuthenticateToken, async (req, res, next) => {
    try {
        const watchlist = await WatchlistModel.findByIdAndDelete(req.body.id)


    } catch (error) {
        next(error)
    }
})

export default router