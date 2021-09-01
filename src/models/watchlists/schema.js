import mongoose from "mongoose"
import createError from "create-error"

const { model, Schema } = mongoose


const WatchlistSchema = new Schema({
    name: { type: String, required: true, unique: true },
    stocks: [
        {
            name: { type: String},
            ticker: { type: String, required: true },
            exchange: { type: String, required: true },
            sector: { type: String, required: true }

        }],
})

WatchlistSchema.post("validate", (error, doc, next) => {
    if (error) {
        console.log(error)
        next(error)
    } else {
        next(error)
    }
})


export default new model("Watchlist", WatchlistSchema)