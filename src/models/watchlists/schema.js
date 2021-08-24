import mongoose from "mongoose"
import createError from "create-error"

const { model, Schema } = mongoose


const WatchlistSchema = new Schema({
    name: { type: String, required: true },
    stocks: [
        {
            name: { type: String, required: true },
            ticker: { type: String, required: true },
            
        }],
})

WatchlistSchema.post("validate", (error, doc, next) => {
    if (error) {
        const err = createError(400, error)
        next(err)
    } else {
        next(error)
    }
})


export default new model("Watchlist", WatchlistSchema)