import createError from 'create-error';
import express from 'express';
import WatchlistModel from '../../models/watchlist/schema'

const router = express.Router()

router.get("/watchlists", async (req, res, next) => {
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

router.post("/watchlists", async (req, res, next) => {
    try {
        const newWatchlist = new WatchlistModel(req.body)
        const savedWatchlist = await newWatchlist.save()
        console.log(savedWatchlist)

        if (savedWatchlist) {
            res.status(201).send(savedWatchlist._id)
        } else {
            next(createError(400, "Failed to create watchlist"))
        }

    } catch (error) {
        next(error)
    }
})

router.put("/watchlists", async (req, res, next) => {
    try {
        const watchlist = await WatchlistModel.findById(req.body.id)

        if (watchlist) {
            const new = new WatchlistModel(req.body)
            const savedPosition = await newPosition.save()
            console.log(savedPosition)
        } else {
            next(createError(404, "Watchlist not found!"))
        }
    } catch (error) {
        next(error)
    }
})
router.delete("/watchlists", async (req, res, next) => {
    try {
        const watchlist = await WatchlistModel.find({ "stock": req.body.stock })

        if (!stock) {
            const new = new WatchlistModel(req.body)
            const savedPosition = await newPosition.save()
            console.log(savedPosition)
        }
    } catch (error) {
        next(error)
    }
})